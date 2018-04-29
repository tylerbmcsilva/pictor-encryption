function main() {
  let dataSourceURL = `${window.location.origin}/api${window.location.pathname}`;
  getServerData(dataSourceURL)
    .then(function(data) {
      window.serverData = data;
      if(window.serverData)
        document.getElementsByTagName('body')[0].innerHTML += `<pre>${JSON.stringify(window.serverData)}</pre>`;
    });

  return {
    getServerData: getServerData
  }
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


!function() {
  document.addEventListener("DOMContentLoaded", main);
}();
