const PAGE_TYPES = ['feed', 'post', 'user'];


async function main(window, document) {
  try {
    const indexedDBConn = await connectIndexedDB('PictorStore', 'keys', 1);
    const keys          = await getDataIndexedDB(indexedDBConn, 'keys', 'test@test.com');
    indexedDBConn.close();
    console.log('got dem keys');
    console.log(keys.privateKey);

    const dataSourceURL = `${window.location.origin}/api${window.location.pathname}`;
    const { data }      = await getDataFromUrl(dataSourceURL);
    console.log('got dem data');
    console.log(data);
    if(data === {})
      throw Error('No Data');

    const decryptedData = await decryptUsingRSA( keys.privateKey, stringToByteArray(data) );
    console.log('decrypted bish')
    // document.getElementsByTagName('main')[0].innerHTML += `<pre>${JSON.stringify(decryptedData)}</pre>`;

    populateDataFromServer(window.location.pathname, decryptedData);

  } catch (e) {
    console.log(e);
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


async function getDataFromUrl(url) {
  return axios.get(url)
    .catch( function (error) {
      console.log(error);
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
      console.error(`UNKNOWN PAGE "${pageName}"`, data);
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


function UserPage(data){
  return Page([
    {
      id:   'user-name',
      data:   data.name
    },
    {
      id:   'user-location',
      data: `${data.location.city}, ${data.location.state}`
    }
  ]);
}

!function() {
  document.addEventListener('DOMContentLoaded', main(window, document));
  M.AutoInit();
}();
