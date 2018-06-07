const PAGE_TYPES = ['feed', 'post', 'friend', 'friends', 'profile', 'settings', 'search'];


async function main(window, document) {
  try {
    // // Get Keys from IndexedDB
    // const indexedDBConn = await connectIndexedDB('PictorStore', 'keys', 1);
    // const keys          = await getDataIndexedDB(indexedDBConn, 'keys', 'test@test.com');
    // indexedDBConn.close();
    // console.log(keys.privateKey);

    if (shouldSkipLoading(window.location.pathname)) {
      return;
    } else {
      // Request data from the server
      const dataSourceURL = `${window.location.origin}/api${window.location.pathname}`;
      const { data }      = await getDataFromUrl(dataSourceURL);
      // console.log(data);
      if (data === '') {
        window.location.replace(`${window.location.origin}/not-found`);
        return;
      }

      // Decrypt the data from the server
      // const decryptedData = await decryptJSON( data, 'test@test.com');
      // console.log(decryptedData);
      // document.getElementsByTagName('main')[0].innerHTML += `<pre>${JSON.stringify(data)}</pre>`;

      populateDataFromServer(window.location.pathname, data);
      //var elems = document.querySelectorAll('.autocomplete');
      //var instances = M.Autocomplete.init(elems, friendsOptions);
    };
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(() => {
      hidePreloader();
    }, 1500);
  }


  function shouldSkipLoading(pathname) {
    switch (true) {
      case /\/not\-found/.test(pathname):
      case /\/post\/\d+\/edit/.test(pathname):
      case /\/post\/new/.test(pathname):
      case /\/success/.test(pathname):
        return true;
        break;
      default:
        return false;
        break;
    }
  }


  function populateDataFromServer(path, data) {
    const pathArray = path.split('/').filter(function(el) {
      return el !== ''
    });
    const pageName  = getPageFromPathArray(pathArray);
    const page      = getPage(pageName);

    return page(data);
  }


  function getPageFromPathArray(pathArray) {
    const pages = pathArray.filter(function(path) {
      return PAGE_TYPES.includes(path);
    })
    return pages[0];
  }


  function getPage(pageName) {
    switch (pageName) {
      case 'feed':
        return FeedPage;
        break;
      case 'post':
        return PostPage;
        break;
      case 'friends':
        return FriendsPage;
        break;
      case 'profile':
      case 'friend':
        return UserPage;
        break;
      case 'settings':
        return SettingsPage;
        break;
      case 'testEncryption':
        return TestEncryptionPage;
        break;
      case 'search':
        return SearchPage;
        break;
      default:
        console.error(`UNKNOWN PAGE "${pageName}"`);
        return;
    }
  }

  async function getFriendActionAttributes(actionType){
    switch(actionType) {
      case 'delete-request':
        return {
          message: '\'s request has been deleted',
          reqFunction: deleteFromUrl,
          extraFunction1: removeElement,
        }
        break;
      case 'delete-friendship':
        return {
          message: '\ has been removed from your friends list',
          reqFunction: deleteFromUrl,
          extraFunction1: removeElement,
        }
        break;
      case 'accept-friend':
        return {
          message: '\'s is now your friend',
          reqFunction: putToUrl,
          extraFunction1: removeElement,
          extraFunction2: addFriendPageFriend,
        }
        break;
      case 'send-request':
        return {
          message: '\ has been sent a friend request',
          reqFunction: putToUrl,
          extraFunction1: updateReqSentElement,
          param: 'Request Sent'
        }
        break;
      case 'unblock-user':
        return {
          message: '\ has been unblocked',
          reqFunction: putToUrl,
          extraFunction1: removeElement,
        }
        break;
      case 'block-user':
        return {
          message: '\ has been blocked',
          reqFunction: putToUrl,
          extraFunction1: removeElement,
        }
        break;
    }
  }

  // mapping argument looks like this:
  //   [ { id: 'id-to-map-to', data: 'data-to-put-in-id'} ]
  function PageMapping(mapping) {
    let i;
    for (i = 0; i < mapping.length; i++) {
      if (mapping[i].id === 'user-picture' && mapping[i].data) {
        document.getElementById(mapping[i].id).src = mapping[i].data;
      } else if (mapping[i].data) {
        document.getElementById(mapping[i].id).innerHTML = mapping[i].data;
      }
    }
  }


  function SettingsMapping(mapping) {
    let i;
    for (i = 0; i < mapping.length; i++) {
      if (mapping[i].id === 'user-picture' && mapping[i].data) {
        document.getElementById(mapping[i].id).src = mapping[i].data;
      } else if (mapping[i].data) {
        // console.log(mapping[i].id);
        document.getElementById(mapping[i].id).value = mapping[i].data;
      }
    }
    M.updateTextFields();
  }


  function PageAppend(id, htmlArray) {
    htmlArray.forEach(function(el) {
      document.getElementById(id).innerHTML += el;
    });
    return;
  }

  function addPageListeners(htmlArray) {
    Array.from(htmlArray).forEach(function(el) {
      el.addEventListener("click", async function(e){
        e.preventDefault;
        const pathName = e.currentTarget.dataset.path;
        const actionType = e.currentTarget.dataset.act;
        const id = e.currentTarget.id;
        const jsonData = await getFriendActionAttributes(actionType);
        try {
          const makeRequest = jsonData.reqFunction;
          const extraFunction1 = jsonData.extraFunction1;
          const extraFunction2 = jsonData.extraFunction2;
          extraFunction1(id);
          const { data } = await makeRequest(`${window.location.origin}/api${pathName}`);
          if(extraFunction2){ extraFunction2(data); }
          successMessage(data, jsonData.message);
        } catch (error) {
          if(error.message === 'Request failed with status code 401') {
            document.getElementById("login-error").innerHTML = "Incorrect email or password";
          } else {
            console.error(error);
          }
        }
        return;
      });
    });
    return;
  }

  function FeedPage(data) {
    let postsListFormatted = data.map(el => {
      return createPostFeedHTML(el);
    });

    PageAppend('feed_start', postsListFormatted);
    return;
  }


  function createPostFeedHTML(post) {
    return `<div class="card-panel">
              <a href="/post/${post.id}" class="indigo-text"><h3 style="margin:0">${post.title}</h3></a>
              <div class="row">
                <div class="col s6">
                  <a href="/friend/${post.user_id}" class="indigo-text"><h5 class="truncate">${post.first_name} ${post.last_name}</h5></a>
                </div>
                <div class="col s6">
                  <h5 class="right-align">${formatSQLDatetime(post.date)}</h5>
                </div>
              </div>
              <a href="${post.url ? post.url : '#'}" class="indigo-text ${post.url ? '' : 'hide'}"><h5>${post.url ? post.url : ''}</h5></a>
              <div id="post-body" class="truncate">
                ${post.body}
              </div>
            </div>`;
  }


  function PostPage(data) {
    console.log(data);
    PageAppend('post_section', [createPostHTML(data)]);
    document.getElementById('delete-post').addEventListener('click', async function(e) {
      const res = await deleteFromUrl(`/api/post/${data.id}`);
      if(res.data.message === 'Success'){
        window.location.pathname = '/profile';
      } else {
        window.location.pathname = '/not-found';
      }

    })
    return;
  }


  function createPostHTML(post) {
    let buttons = '';

    if(post.editable) {
      buttons = `<a href="/post/${post.id}/edit" class="transparent blue-grey-text lighten-5-text"><i class="small material-icons">edit</i></a>
      <a href="#" id="delete-post" class="transparent blue-grey-text lighten-5-text"><i class="small material-icons">delete_forever</i></a>`;
    }

    return `<div class="card-panel">
              <div class="row">
                <h3 class="col s10" style="margin:0">${post.title}</h3>
                <div class="col s2 ${post.editable ? '' : 'hide'} right-align">
                  ${buttons}
                </div>
              </div>

              <div class="row">
                <div class="col s6">
                  <a href="/friend/${post.user_id}" class="indigo-text"><h5 class="truncate">${post.first_name} ${post.last_name}</h5></a>
                </div>
                <div class="col s6">
                  <h5 class="right-align">${formatSQLDatetime(post.date)}</h5>
                </div>
              </div>
              <a href="${post.url ? post.url : '#'}" class="indigo-text ${post.url ? '' : 'hide'}"><h5>${post.url ? post.url : ''}</h5></a>
              <div id="post-body">
                ${post.body}
              </div>
            </div>`;
  }


  function FriendsPage(data) {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {dismissible:true});
    const friendsFormatted = data.friends.map((el) => {
      let friend = {
        id: el.id,
        name: `${el.first_name} ${el.last_name}`,
        photo: 'https://i.imgur.com/FyWI0.jpg',
        path1: `/friend/${el.id}`,
        path2: `/friend/${el.id}/block`,
        act1: 'delete-friendship',
        act2: 'block-user'
      };
      return createFriendCard(friend);
    });
    PageAppend('friends_list', friendsFormatted);

    const currentInboundRequests = data.currentRequests.map((el) => {
      if (el.id === el.sender_id) {
        return createCollectionItemInbound({
          title: `${el.first_name} ${el.last_name}`,
          id: el.id,
          icon1: 'check',
          icon2: 'close',
          path1: `/friend/${el.id}/accept`,
          path2: `/friend/${el.id}`,
          act1: 'accept-friend',
          act2: 'delete-request'
        });
      } else {
        return '';
      }
    });
    PageAppend('received_requests', currentInboundRequests);

    const currentOutboundRequests = data.currentRequests.map((el) => {
      if (el.id === el.receiver_id) {
        return createCollectionItemOutbound({
          title: `${el.first_name} ${el.last_name}`,
          id: el.id,
          icon1: 'close',
          path1: `/friend/${el.id}`,
          act1: 'delete-request'
        });
      } else {
        return '';
      }
    });
    PageAppend('sent_requests', currentOutboundRequests);
    var secondaryContent = document.getElementsByClassName('secondary-content');
    var cardActionLinks = document.getElementsByClassName('friend-action-content');
    addPageListeners(secondaryContent);
    addPageListeners(cardActionLinks);
    return;
  }


  function createFriendCard(friend) {
    return `<div class="col s6 m4 l3" id="friend${friend.id}">
                <div class="card">
                  <div class="card-image">
                    <img src="${friend.photo}">
                    <span class="card-title">${friend.name}</span>
                  </div>
                  <div class="card-action">
                    <a href="/friend/${friend.id}" >Visit Profile</a>
                  </div>
                  <div class="card-action">
                  <a href="#success-modal" id="friend${friend.id}" class="friend-action-content card-action red-text darken-4 modal-trigger" data-path="${friend.path1}" data-act="delete-friendship">
                    DELETE
                  </a>
                  </div>
                  <div class="card-action">
                  <a href="#success-modal" id="friend${friend.id}" class="friend-action-content card-action indigo-text darken-4 modal-trigger" data-path="${friend.path2}" data-act="block-user">
                    BLOCK
                  </a>
                  </div>
                </div>
              </div>`;
  }


  function createCollectionItem(item) {
    return `<li class="collection-item" id="req${item.id}">
              <div id="req${item.id}">${item.title}
                <a href="#success-modal" id="req${item.id}" class="secondary-content modal-trigger" data-path="${item.path1}" data-act="${item.act1}">
                  <i class="material-icons">${item.icon1}</i>
                </a>
                <a href="#success-modal" id="req${item.id}" class="secondary-content modal-trigger" data-path="${item.path2}" data-act="${item.act2}">
                  <i class="material-icons">${item.icon2}</i>
                </a>
              </div>
            </li>`;
  }

  function createCollectionItemOutbound(item) {
    return `<li class="collection-item" id="req${item.id}">
              <div id="req${item.id}">${item.title}
                <a href="#success-modal" id="req${item.id}" class="secondary-content modal-trigger" data-path="${item.path1}" data-act="${item.act1}">
                  <i class="material-icons">${item.icon1}</i>
                </a>
              </div>
            </li>`;
  }

  function createCollectionItemInbound(item) {
    return `<li class="collection-item" id="req${item.id}">
              <div id="req${item.id}">${item.title}
                <a href="#success-modal" id="req${item.id}" class="secondary-content modal-trigger" data-path="${item.path1}" data-act="${item.act1}">
                  <i class="material-icons">${item.icon1}</i>
                </a>
                <a href="#success-modal" id="req${item.id}" class="secondary-content modal-trigger" data-path="${item.path2}" data-act="${item.act2}">
                  <i class="material-icons">${item.icon2}</i>
                </a>
              </div>
            </li>`;
  }



  function SearchPage(data) {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {dismissible:true, inDuration: 400});
    const friendResults = data.friends.map(el => {
      return createSearchInfoCard({
        id:       el.id,
        name:     `${el.first_name} ${el.last_name}`,
        location: el.location,
        photo:    'https://i.imgur.com/FyWI0.jpg', //replace with image eventually
        link:      `/friend/${el.id}`,
        message: 'View Profile',
        color: 'light-blue-text text-darken-3'
      });
    });
    PageAppend('search_results', friendResults);

    const noRequestResults = data.notFriendsNoRequest.map((el) => {
      return createSearchInfoSendRequestCard({
          id:       el.id,
          name:     `${el.first_name} ${el.last_name}`,
          location: el.location,
          photo:    'https://i.imgur.com/FyWI0.jpg', //replace with image eventually,
          path1: `/friend/${el.id}/request`,
          message: 'Send Request',
          act1: 'send-request',
          color: 'green-text text-darken-4'
        });
    });
    PageAppend('search_results', noRequestResults);

    const requestSentResults= data.notFriendsRequestSent.map((el) => {
      return createSearchInfoCard({
          id:       el.id,
          name:     `${el.first_name} ${el.last_name}`,
          location: el.location,
          photo:    'https://i.imgur.com/FyWI0.jpg', //replace with image eventually
          link:      `/friends`,
          message: 'Request Sent',
          color: 'green-text text-lighten-4'
      });
    });
    PageAppend('search_results', requestSentResults);


    const requestReceivedResults= data.notFriendsRequestReceived.map((el) => {
      return createSearchInfoCard({
            id:       el.id,
            name:     `${el.first_name} ${el.last_name}`,
            location: el.location,
            photo:    'https://i.imgur.com/FyWI0.jpg', //replace with image eventually
            link:      `/friends`,
            message: 'Respond to request',
            color: 'indigo-text text-darken-4'
      });
    });
    PageAppend('search_results', requestReceivedResults);

    var secondaryContent = document.getElementsByClassName('sent');
    addPageListeners(secondaryContent);
  }


  function createSearchInfoCard(user) {
    return `<li class="collection-item avatar">
              <img src="${user.photo}" alt="" class="circle">
              <span class="title">Name: ${user.name}</span>
              <p>From: ${user.location}</p>
              <a href="${user.link}" class="${user.color}"> ${user.message}</a>
            </li>`;
  }

  function createSearchInfoSendRequestCard(user) {
    return `<li class="collection-item avatar" id="${user.id}">
              <img src="${user.photo}" alt="" class="circle">
              <span class="title">Name: ${user.name}</span>
              <p>From: ${user.location}</p>
              <a href="#success-modal" id="req${user.id}" class="sent modal-trigger ${user.color}" data-path="${user.path1}" data-act="${user.act1}">
              ${user.message}
              </a>
            </li>`;
  }


  function createFriendListCard(friend) {
    return `<li class="collection-item avatar">
              <img src="${friend.photo}" alt="" class="circle">
              <span class="title">${friend.name}</span>
              <p><a href="/friend/${friend.id}">Visit Profile</a></p>
            </li>`;
  }


  function ProfileFriendsList(data) {
    const friendsFormatted = data.friends.map((el) => {
      let friend = {
        id: el.id,
        name: `${el.first_name} ${el.last_name}`,
        photo: 'https://i.imgur.com/FyWI0.jpg',
        // location: `${el.location}`
      };
      return createFriendListCard(friend);
    });
    PageAppend('friends_list', friendsFormatted);
  }


  function UserPage(data) {
    const { basic, encrypted, posts, friends } = data;
    if (posts) {
      FeedPage(posts);
    }
    if (friends) {
      ProfileFriendsList(friends);
    }

    let pageMapping = [{
        id: 'user-name',
        data: `${basic.name.first} ${basic.name.last}`
      },
      {
        id: 'user-location',
        data: basic.location
      },
      {
        id: 'user-email',
        data: basic.email
      }
    ];
    if (encrypted) {
      Array.prototype.push.apply(pageMapping, [{
          id: 'user-phone',
          data: encrypted.phone
        },
        {
          id: 'user-gender',
          data: encrypted.gender
        },
        {
          id: 'user-birthdate',
          data: encrypted.birthdate
        },
        {
          id: 'user-language',
          data: encrypted.language
        },
        {
          id: 'user-school',
          data: encrypted.school
        },
        {
          id: 'user-work',
          data: encrypted.work
        },
        {
          id: 'user-picture',
          data: encrypted.picture
        }
      ]);
    }
    return PageMapping(pageMapping);
  }

  function createBlockedListCard(user) {
    return `<li class="collection-item avatar" id="${user.id}">
              <img src="${user.photo}" alt="" class="circle">
              <span class="title">Name: ${user.name}</span>
              <p>From: ${user.location}</p>
              <a href="#success-modal" id="req${user.id}" class="unblock modal-trigger ${user.color}" data-path="${user.path1}" data-act="${user.act1}">
              ${user.message}
              </a>
            </li>`;
  }

  function BlockedUsersPage(data) {
    const blockedFormatted = data.map((el) => {
      return createBlockedListCard({
          id:       el.id,
          name:     `${el.first_name} ${el.last_name}`,
          location: el.location,
          photo:    'https://i.imgur.com/FyWI0.jpg', //replace with image eventually,
          path1: `/friend/${el.id}/unblock`,
          message: 'Unblock',
          act1: 'unblock-user',
          color: 'green-text text-darken-4'
        });
    });
    PageAppend('blocked_users', blockedFormatted);

    var cardActionLinks = document.getElementsByClassName('unblock');
    addPageListeners(cardActionLinks);
  }

  function successMessage(data, message) {
    const fullName = `${data.first_name} ${data.last_name}`;
    document.getElementById("success-message").innerHTML = fullName;
    document.getElementById("success-message").innerHTML += message;
  }

  function SettingsPage(data) {
    const { basic, encrypted, blocked } = data;

    if (blocked) {
      BlockedUsersPage(blocked);
    }

    let pageMapping = [{
        id: 'user-firstname',
        data: basic.name.first
      },
      {
        id: 'user-lastname',
        data: basic.name.last
      },
      {
        id: 'user-location',
        data: basic.location
      }
    ];
    if (encrypted) {
      Array.prototype.push.apply(pageMapping, [{
          id: 'user-phone',
          data: encrypted.phone
        },
        {
          id: 'user-gender',
          data: encrypted.gender
        },
        {
          id: 'user-birthdate',
          data: encrypted.birthdate
        },
        {
          id: 'user-language',
          data: encrypted.language
        },
        {
          id: 'user-school',
          data: encrypted.school
        },
        {
          id: 'user-work',
          data: encrypted.work
        },
        {
          id: 'user-picture',
          data: encrypted.picture
        }
      ]);
    }
    return SettingsMapping(pageMapping);
  }


  function formatSQLDatetime(datetime) {
    const d = new Date(datetime);
    return d.toDateString();
  }

  function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
  }

  function updateReqSentElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.innerHTML = "";
  }

  function addFriendPageFriend(data) {
    const friend = {
        id: data.id,
        name: `${data.first_name} ${data.last_name}`,
        photo: 'https://i.imgur.com/FyWI0.jpg',
        path1: `/friend/${data.id}`,
        path2: `/friend/${data.id}/block`,
        act1: 'delete-friendship',
        act2: 'block-user'
      };
    const friendCard = createFriendCard(friend);
    var element = document.getElementById('friends_list');
    element.innerHTML += friendCard;
    var cardActionLinks = document.getElementsByClassName('friend-action-content');
    addPageListeners(cardActionLinks);
  }
}


!function() {
  document.addEventListener('DOMContentLoaded', main(window, document));
  M.AutoInit();
}();
