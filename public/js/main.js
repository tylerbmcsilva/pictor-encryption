const PAGE_TYPES = ['feed', 'post', 'user'];
const AUTHENTICATED = true;


function main(window, document) {
  /************ FOR ENCRYPTION TEST ***************/
  // "use strict";
  // var generateKeyPairButton = document.getElementById("generateKeyPair");
  // //var generateCipherKeyButton = document.getElementById("generateCipherKey");
  // var generateStoreServerButton = document.getElementById("genStoreServerKey");
  // var retrieveServerPublicButton = document.getElementById("retrieveServerKey");
  // var generateCipherKeyButton = document.getElementById("generateCipherKey");
  // generateKeyPairButton.addEventListener("click", keyGenRSA); // Alice's key pair
  // generateCipherKeyButton.addEventListener("click", keyGenAES); // Alice's cipher key
  // generateStoreServerButton.addEventListener("click", genStoreSKP); // Server's key pair and store
  // retrieveServerPublicButton.addEventListener("click", retSPK);
  /************************************************/

  let dataSourceURL = `${window.location.origin}/api${window.location.pathname}`;
  console.log(dataSourceURL)
  getDataFromUrl(dataSourceURL)
    .then(function(data) {
      if(data)
        return data;
      else
        throw Error('No Data');
    }).then(function(data) {
      // **********************
      // DECRYPT HERE
      // **********************
      return data;
    }).then(function(data) {
      if(data) {
        // **********************
        // EVENTUALLY REMOVE
        // **********************
          document.getElementsByTagName('main')[0].innerHTML += `<pre>${JSON.stringify(data)}</pre>`;
        // **********************
        // EVENTUALLY REMOVE
        // **********************

        // Loads the data from the server onto the page
        populateDataFromServer(window.location.pathname, data);
      }

      return;

    }).finally(function() {
      // Hide preloader after 2 seconds
      setTimeout(function() {
        hidePreloader(document);
      }, 2000);

    }).catch(function(error) {
      if(error.message === 'No Data')
        return;
      else {
        throw error;
      }
    });
}


function populateDataFromServer(path, data){
  const pathArray = path.split('/').filter(function(el){ return el !== ''});
  const pageName  = getPageFromPathArray(pathArray);
  const page      = getPage(pageName);

  return page(data);
}


function getDataFromUrl(url) {
  console.log(`REQUESTING FROM ${url}`);
  return axios.get(url)
    .then(function(r){
      if(r.status === 404)
        return {};
      else
        return r.data;
    })
    .catch(function(err){
      // SILENTLY FAIL
      // console.log(err);
      return;
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
  let mapping = [
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
    }
  ];

  if(AUTHENTICATED){
    let mappingEncrypted = [
      {
        id:   'user-phone',
        data: data.encrypted.phone
      },
      {
        id:   'user-gender',
        data: data.encrypted.gender
      },
      {
        id:   'user-dob',
        data: data.encrypted.dob
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
    ];
    mapping = mapping.concat(mappingEncrypted);
  }

  return Page(mapping);
}


function hidePreloader(d) {
  let pl = d.getElementById('preloader');
  pl.classList.remove('active');
  pl.classList.add('hide');

  let plw = d.getElementById('preloader-wrapper');
  plw.classList.remove('full-height');
  plw.classList.add('hide');
}


!function() {
  document.addEventListener('DOMContentLoaded', main(window, document));
  M.AutoInit();
}();
