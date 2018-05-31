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
    console.log(pathname);
    switch (true) {
      case /\/not\-found/.test(pathname):
      case /\/post\/\d+\/edit/.test(pathname):
      case /\/post\/new/.test(pathname):
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
    const pageName = getPageFromPathArray(pathArray);
    console.log(pageName);
    const page = getPage(pageName);

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
    PageAppend('post_section', [createPostHTML(data)]);
    document.getElementById('delete-post').addEventListener('click', async function(e) {
      const { data } = await deleteFromUrl(`/api/post/${data.id}`);
      if(data.message === 'Success'){
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

    const friendsFormatted = data.friends.map((el) => {
      let friend = {
        id: el.id,
        name: `${el.first_name} ${el.last_name}`,
        photo: 'https://i.imgur.com/FyWI0.jpg',
      };
      return createFriendCard(friend);
    });
    PageAppend('friends_list', friendsFormatted);

    const currentInboundRequests = data.currentRequests.map((el) => {
      if (el.id === el.sender_id) {
        return createCollectionItem({
          title: `${el.first_name} ${el.last_name}`,
          link: `#`,
          icon: 'check'
        });
      } else {
        return '';
      }
    });
    PageAppend('received_requests', currentInboundRequests);

    const currentOutboundRequests = data.currentRequests.map((el) => {
      if (el.id === el.receiver_id) {
        return createCollectionItem({
          title: `${el.first_name} ${el.last_name}`,
          link: `/friend/${el.id}`,
          icon: 'access_time'
        });
      } else {
        return '';
      }
    });
    PageAppend('sent_requests', currentOutboundRequests);

    return;
  }


  function createFriendCard(friend) {
    return `<div class="col s6 m4 l3">
                <div class="card">
                  <div class="card-image">
                    <img src="${friend.photo}">
                    <span class="card-title">${friend.name}</span>
                  </div>
                  <div class="card-action">
                    <a href="/friend/${friend.id}">Visit Profile</a>
                  </div>
                  <div class="card-action">
                    <a class="red-text darken-4" href="/friends/delete/${friend.id}">Delete</a>
                  </div>
                  <div class="card-action">
                    <a class="indigo-text darken-4" href="/friends/block/${friend.id}">Block</a>
                  </div>
                </div>
              </div>`;
  }


  function createCollectionItem(item) {
    return `<li class="collection-item"><div>${item.title}<a href="${item.link}" class="secondary-content"><i class="material-icons">${item.icon}</i></a></div></li>`;
  }


  function createInfoCard(user) {
    return `<li class="collection-item avatar">
              <img src="${user.photo}" alt="" class="circle">
              <span class="title">Name: ${user.name}</span>
              <p>From: ${user.location}</p>
              ${user.url}
            </li>`;
  }


  function SearchPage(data) {
    const usersFormatted = data.map(el => {
      let user = {
        id:       el.id,
        name:     `${el.first_name} ${el.last_name}`,
        location: el.location,
        photo:    'https://i.imgur.com/FyWI0.jpg', //replace with image eventually
        url:      `/friend/${el.id}`
      };
      return createInfoCard(user);
    });
    return PageAppend('search_results', usersFormatted);
  }


  function createFriendListCard(user) {
    return `<li class="collection-item avatar">
              <img src="${user.photo}" alt="" class="circle">
              <span class="title">${user.name}</span>
              <p><a href="/friend/${user.id}">Visit Profile</a></p>
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


  function SettingsPage(data) {
    const { basic, encrypted } = data;

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
      },
      // {
      //   id:   'user-email',
      //   data: basic.email
      // }
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
}


!function() {
  document.addEventListener('DOMContentLoaded', main(window, document));
  M.AutoInit();
}();
