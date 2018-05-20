const PAGE_TYPES = ['feed', 'post', 'friend', 'friends', 'profile'];


async function main(window, document) {
  try {
    // // Get Keys from IndexedDB
    // const indexedDBConn = await connectIndexedDB('PictorStore', 'keys', 1);
    // const keys          = await getDataIndexedDB(indexedDBConn, 'keys', 'test@test.com');
    // indexedDBConn.close();
    // console.log(keys.privateKey);

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
  const page      = getPage(pageName);

  return page(data);
}


async function getDataFromUrl(url, key) {
  return axios.get(url, {
    headers: {
      'User-P-K': key
    }
  })
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
    case 'testEncryption':
      return TestEncryptionPage;
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
    document.getElementById(mapping[i].id).innerHTML = mapping[i].data;
  }
}

function PageAppend(id, htmlArray) {
  htmlArray.forEach(function(el) {
    document.getElementById(id).innerHTML += el;
  });
  return;
}


function FeedPage(data){
  let postsListFormatted = data.map( el => {
    return createPostHTML(el);
  });

  PageAppend('feed_start', postsListFormatted);
}


function createPostHTML(post) {
  return `<li class="collection-item" id="post-${post.id}">
            <span class="title">User #
              <a href="friend/${post.user_id}" id="post-user-${post.user_id}">${post.user_id}</a>
            </span>
            </br>
            <a href="${post.url}" class="left" id="post-title-${post.id}">${post.title}</a>
            <span class="right" id="post-date-${post.id}">${post.date}</span>
            </br>
            <p id="post-body-${post.id}">${post.body}</p>
          </li>
        `;
}


function PostPage(data){
  console.log('POST', data);
  return;
}


function FriendsPage(data) {
  const friendsFormatted = data.map( el => {
    let friend = {
        id:     el.id,
        name:   `${el.first_name} ${el.last_name}`,
        photo:  'https://i.imgur.com/FyWI0.jpg'
      };
    return createFriendCard(friend);
  });
  PageAppend('friends_list', friendsFormatted);
  return;
}


function createFriendCard(friend) {
  return `<div class="col s12 m4 l3">
            <div class="card">
              <div class="card-image">
                <img src="${friend.photo}">
                <span class="card-title">${friend.name}</span>
              </div>
              <div class="card-action">
                <a href="/friend/${friend.id}">Vist Profile</a>
              </div>
            </div>
          </div>`;
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
      data: `${basic.location.city}, ${basic.location.state}`
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
      }
    ]);
  }

  return PageMapping(pageMapping);
}

!function() {
  document.addEventListener('DOMContentLoaded', main(window, document));
  M.AutoInit();
}();
