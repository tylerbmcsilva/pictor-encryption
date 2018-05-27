const PAGE_TYPES = ['feed', 'post', 'friend', 'friends', 'profile', 'settings', 'search'];


async function main(window, document) {
  try {
    // // Get Keys from IndexedDB
    // const indexedDBConn = await connectIndexedDB('PictorStore', 'keys', 1);
    // const keys          = await getDataIndexedDB(indexedDBConn, 'keys', 'test@test.com');
    // indexedDBConn.close();
    // console.log(keys.privateKey);

    // TODO: Figure out a way to handle other pages we don't want to load data on
    if(window.location.pathname === '/post/new')
      return;

    // Request data from the server
    const dataSourceURL = `${window.location.origin}/api${window.location.pathname}`;
    const { data }      = await getDataFromUrl(dataSourceURL);
    console.log(data);
    if(data === '') {
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
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(function() {
      hidePreloader(document);
    }, 1500);
  }
}


function populateDataFromServer(path, data){
  const pathArray = path.split('/').filter(function(el){ return el !== ''});
  const pageName  = getPageFromPathArray(pathArray);
  console.log(pageName);
  const page      = getPage(pageName);

  return page(data);
}


async function getDataFromUrl(url) {
      return axios.get(url)
        .catch( function (error) {
          console.error(error);
          throw error;
        });
}


function getPageFromPathArray(pathArray) {
  const pages = pathArray.filter(function(path){
    return PAGE_TYPES.includes(path);
  })
  return pages[0];
}


function getPage(pageName) {
  switch(pageName){
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
    if (mapping[i].id === 'user-picture' && mapping[i].data ) {
      document.getElementById(mapping[i].id).src = mapping[i].data;
    }
    else if (mapping[i].data){
      document.getElementById(mapping[i].id).innerHTML = mapping[i].data;
    }
  }
}

function SettingsMapping(mapping) {
  let i;
  for (i = 0; i < mapping.length; i++) {
    if (mapping[i].id === 'user-picture' && mapping[i].data ) {
      document.getElementById(mapping[i].id).src = mapping[i].data;
    }
    else if (mapping[i].data){
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


function FeedPage(data){
  let postsListFormatted = data.map( el => {
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
                <a href="/friend/${post.user_id}" class="indigo-text"><h5 class="truncate">#${post.user_id}</h5></a>
              </div>
              <div class="col s6">
                <h5 class="right-align">${post.date}</h5>
              </div>
            </div>
            <a href="${post.url ? post.url : '#'}" class="indigo-text ${post.url ? '' : 'hide'}"><h5>${post.url ? post.url : ''}</h5></a>
            <div id="post-body" class="truncate">
              ${post.body}
            </div>
          </div>`;
}


function PostPage(data){
  PageAppend('post_section', [ createPostHTML(data) ]);
  return;
}

function createPostHTML(post) {
  return `<div class="card-panel">
            <h3 style="margin:0">${post.title}</h3>
            <div class="row">
              <div class="col s6">
                <a href="/friend/${post.user_id}" class="indigo-text"><h5 class="truncate">#${post.user_id}</h5></a>
              </div>
              <div class="col s6">
                <h5 class="right-align">${post.date}</h5>
              </div>
            </div>
            <a href="${post.url ? post.url : '#'}" class="indigo-text ${post.url ? '' : 'hide'}"><h5>${post.url ? post.url : ''}</h5></a>
            <div id="post-body">
              ${post.body}
            </div>
          </div>`;
}


function FriendsPage(data) {

  const friendsFormatted = data.map( el => {
    let friend = {
        id:     el.id,
        name:   `${el.first_name} ${el.last_name}`,
        photo:  'https://i.imgur.com/FyWI0.jpg',
        date: el.date,
        location: el.location,
        friend_bool: el.friend_bool,
        rreq_bool: el.rreq_bool,
        sreq_bool: el.sreq_bool,
        blocked_bool: el.blocked_bool
      };
    return createFriendCard(friend);
  });
  PageAppend('friends_list', friendsFormatted);
  return;
}

function SearchPage(data) {
  const usersFormatted = data.map( el => {
    let user = {
        id:     el.id,
        name:   `${el.first_name} ${el.last_name}`,
        location: el.location,
        photo:  'https://i.imgur.com/FyWI0.jpg', //replace with image eventually
        friend_bool: el.friend_bool
      };
    return createInfoCard(user);
  });
  PageAppend('search_results', usersFormatted);
  return;
}

function createFriendCard(friend) {
  if(friend.friend_bool){
    return `<div class="col s6 m4 l3">
              <div class="card">
                <div class="card-image">
                  <img src="${friend.photo}">
                  <span class="card-title">${friend.name}</span>
                </div>
                <div class="card-action">
                  <a href="/friend/${friend.id}">Vist Profile</a>
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
  else{
     return createInfoCard(friend);
  }
}

function createInfoCard(user){
  var link = `<a href="/friends/sendRequest/${user.id}">Send Friend Request</a>`;
  if(user.friend_bool){
    var link = `<a href="/friend/${user.id}">Vist Profile</a>`;
  }
  else if(user.sreq_bool){
    var link = `<a >Request Sent: ${user.date}</a>`;
  }
  else if(user.blocked_bool){
    var link = `<a href="/friends/unblock/${user.id}">Unblock User</a>`;
  }
  else if(user.rreq_bool){
    var link = `<a href="/friends/accept/${user.id}" id="acceptRequest">Add User</a><br>` +
      `<a href="/friends/delete/${user.id}" id="deleteFriend">Delete Request</a>`;
  }

  return `<li class="collection-item avatar">
            <img src="${user.photo}" alt="" class="circle">
            <span class="title">Name: ${user.name}</span>
            <p>From: ${user.location}</p>
            ${link}
          </li>`;
}


function UserPage(data){
  const { basic, encrypted } = data;
  let pageMapping = [
    {
      id:   'user-name',
      data: `${basic.name.first} ${basic.name.last}`
    },
    {
      id:   'user-location',
      data: basic.location
    },
    {
      id:   'user-email',
      data: basic.email
    }
  ];
  if(encrypted){
    Array.prototype.push.apply(pageMapping, [
      {
        id:   'user-phone',
        data: encrypted.phone
      },
      {
        id:   'user-gender',
        data: encrypted.gender
      },
      {
        id:   'user-birthdate',
        data: encrypted.birthdate
      },
      {
        id:   'user-language',
        data: encrypted.language
      },
      {
        id:   'user-school',
        data: encrypted.school
      },
      {
        id:   'user-work',
        data: encrypted.work
      },
      {
        id:   'user-picture',
        data: encrypted.picture
      }
    ]);
  }
  return PageMapping(pageMapping);
}

function SettingsPage(data){
  const { basic, encrypted } = data;
  let pageMapping = [
    {
      id:   'user-firstname',
      data: basic.name.first
    },
    {
      id:   'user-lastname',
      data: basic.name.last
    },
    {
      id:   'user-location',
      data: basic.location
    },
    // {
    //   id:   'user-email',
    //   data: basic.email
    // }
  ];
  if(encrypted){
    Array.prototype.push.apply(pageMapping, [
      {
        id:   'user-phone',
        data: encrypted.phone
      },
      {
        id:   'user-gender',
        data: encrypted.gender
      },
      {
        id:   'user-birthdate',
        data: encrypted.birthdate
      },
      {
        id:   'user-language',
        data: encrypted.language
      },
      {
        id:   'user-school',
        data: encrypted.school
      },
      {
        id:   'user-work',
        data: encrypted.work
      },
      {
        id:   'user-picture',
        data: encrypted.picture
      }
    ]);
  }
  return SettingsMapping(pageMapping);
}

!function() {
  document.addEventListener('DOMContentLoaded', main(window, document));
  M.AutoInit();
}();
