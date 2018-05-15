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
    }, 2000);
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
  for (i = 0; i < mapping.length; i++) {
    document.getElementById(mapping[i].id).innerHTML = mapping[i].data;
  }
  return;
}


function FeedPage(data){
  console.log('FEED', data);
  return;
}


function PostPage(data){
  console.log('POST', data);
  return;
}

// mapping argument looks like this:
//   [ { id: 'id-to-map-to', data: 'data-to-put-in-id'} ]
function Page(mapping) {
  let i;
  for (i = 0; i < mapping.length; i++) {
    document.getElementById(mapping[i].id).innerHTML = mapping[i].data;
  }
  return;
}


function FeedPage(data){
  console.log('FEED', data);
  return;
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
