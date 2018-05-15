const PAGE_TYPES = ['feed', 'post', 'user'];


async function main(window, document) {
  try {
    // Get Keys from IndexedDB
    const indexedDBConn = await connectIndexedDB('PictorStore', 'keys', 1);
    const keys          = await getDataIndexedDB(indexedDBConn, 'keys', 'test@test.com');
    indexedDBConn.close();
    console.log(keys.privateKey);

    // Request data from the server
    const dataSourceURL = `${window.location.origin}/api${window.location.pathname}`;
    const { data }      = await getDataFromUrl(dataSourceURL, keys.publicKey);
    console.log(data);
    if(data === {})
      throw Error('No Data');

    // Decrypt the data from the server
    const decryptedData = await decryptJSON( data, 'test@test.com');
    console.log(decryptedData);
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
    case 'user':
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
function Page(mapping) {
  let i;
  if (Array.isArray(mapping[0])) {
    mapping.forEach(function(arr) {
      for (i = 0; i < arr.length; i++) {
        try {
          document.getElementById(arr[i].id).innerHTML += arr[i].data;
        }
        catch(err) {  // do nothing if element with id is not found
          continue;
        }
      }
    });
  } else {
    for (i = 0; i < mapping.length; i++) {
      document.getElementById(mapping[i].id).innerHTML = mapping[i].data;
    }
  }

  return;
}


function FeedPage(data){
  let mapping = [];

  let i;
  for (i = 0; i < data.length; i++) {
    let post = ([
      {
        id:   'post-user-' + i,
        data: data[i].user_id
      },
      {
        id:   'post-title-' + i,
        data: data[i].title
      },
      {
        id:   'post-body-' + i,
        data:  data[i].body
      },
      {
        id:   'post-date-' + i,
        data:  data[i].date
      },
      {
        id:   'post-url-' + i,
        data:  data[i].url
      },
      {
        id:   'post-type-' + i,
        data:  data[i].post_type
      },
      {
        id:   'post-encrypted-' + i,
        data:  data[i].encrypted
      },
      {
        id:   'post-id',
        data: data[i].id
      }
    ]);
    mapping.push(post);
  }
  createFeedHTML(mapping);

  return Page(mapping);
}


/*
See function FeedPage for mappings
0 = user id
1 = post title
2 = post body
3 = post date
4 = post url
5 = post type
6 = encrypted flag
7 = post-id
*/
function createFeedHTML(mapping) {
  let start = document.getElementById('feed_start');
  mapping.forEach(function(post) {
    start.innerHTML +=
     `<li class="collection-item" id="post-${post[7].data}">
        <span class="title">User #
          <a href="user/${post[0].data}" id="${post[0].id}"></a>
        </span>
        </br>
        <a href="${post[4].data}" class="left" id="${post[1].id}"></a>
        <span class="right" id="${post[3].id}">
        </span>
        </br>
        <p id="${post[2].id}"></p>
      `;
    if (post[6].data) {
      document.getElementById(`post-${post[7].data}`).innerHTML += `<i class="material-icons">lock_outline</i>`
    }
  });
}


function PostPage(data){
  console.log('POST', data);
  return;
}


function UserPage(data){
  return Page([
    {
      id:   'user-name',
      data: `${data.basic.name.first} ${data.basic.name.last}`
    },
    {
      id:   'user-location',
      data: `${data.basic.location.city}, ${data.basic.location.state}`
    },
    {
      id:   'user-email',
      data: data.basic.email
    },
    {
      id:   'user-phone',
      data: data.encrypted.phone
    },
    {
      id:   'user-gender',
      data: data.encrypted.gender
    },
    {
      id:   'user-birthdate',
      data: data.encrypted.birthdate
    },
    {
      id:   'user-language',
      data: data.encrypted.language
    },
    {
      id:   'user-school',
      data: data.encrypted.school
    },
    {
      id:   'user-work',
      data: data.encrypted.work
    }
  ]);
}

!function() {
  document.addEventListener('DOMContentLoaded', main(window, document));
  M.AutoInit();
}();
