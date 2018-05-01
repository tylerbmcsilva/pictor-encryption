const PAGE_TYPES = ['feed', 'post', 'user'];


function main(window, document) {
  let dataSourceURL = `${window.location.origin}/api${window.location.pathname}`;

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
      if(window.serverData) {
        // **********************
        // EVENTUALLY REMOVE
        // **********************
        document.getElementsByClassName('main-page')[0].innerHTML += `<pre>${JSON.stringify(window.serverData)}</pre>`;

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
