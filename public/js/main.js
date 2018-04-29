const PAGE_TYPES = ['feed', 'post', 'user'];


function main(window, document) {
  let dataSourceURL = `${window.location.origin}/api${window.location.pathname}`;

  getDataFromUrl(dataSourceURL)
    .then(function(data) {
      window.serverData = data;
      return data;

    }).then(function(data) {
      // decrypt
      return data;

    }).then(function(data) {
      if(window.serverData)
        document.getElementsByTagName('body')[0].innerHTML += `<pre>${JSON.stringify(window.serverData)}</pre>`;
        populateDataFromServer(window.location.pathname, data);
      return;

    }).finally(function() {
      hidePreloader(document);
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
      return r.data
    })
    .catch(function(err){
      console.log(err);
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
  pl.classList.remove('active')
  pl.classList.add('hide');
}

!function() {
  document.addEventListener('DOMContentLoaded', main(window, document));
}();
