
let key;
let serverResponse;
let secret;

// Function to grab info from form
document.getElementById('loginbutton').addEventListener('click', sendSigninForm);

async function sendSigninForm(e) {
    let user = document.getElementById('email').value;
    await getDataFromIndexedDB(user);

    let payload = {
      user: user
    };
    if(user) {
      postDataToUrl(e, '/signin', payload);
      // 1. decrypt response with private key
      // 2. encrypt response with server key
      payload.response = "CLIENT RE-ENCRYPTS SECRET";
      console.log(payload);
      postDataToUrl(e, '/signin/verify', payload);
    } else {
      console.log("user does not exist");
    }
}

async function postDataToUrl(e, url, data) {
  axios.post(url, data)
    .then(function(res) {
      serverResponse = res.data;
      console.log(serverResponse);
    })
    .catch(function(err) {
      // SILENTLY FAIL
      return;
    });
    e.preventDefault();
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
