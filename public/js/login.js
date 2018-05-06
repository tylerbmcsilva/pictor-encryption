
let user;
let key;

// Function to grab info from form
function sendDataFromForm() {
  document.getElementById('loginbutton').addEventListener('click', function(event) {
    user =  document.getElementById('email').value;
    key = getDataFromIndexedDB(user);
  });
}

// Function to grab key from indexedDB
async function getDataFromIndexedDB(id) {
  let conn;
  try {
    conn = await connect("PictorStore", "keys", 1);
    key = await getData(conn, "keys", id);
  } catch(exception) {
    console.log(exception);
  } finally {
    if(conn)
      conn.close();
  }
}

!function() {
  document.addEventListener('DOMContentLoaded', sendDataFromForm);
  // M.AutoInit();
}();
