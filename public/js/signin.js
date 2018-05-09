
let USER_KEY = null;
let SERVER_RESPONSE;
let SECRET;

// Function to grab info from form
document.getElementById("loginbutton").addEventListener("click", sendSigninForm);

async function sendSigninForm(e) {
  e.preventDefault();

  let user = document.getElementById("email").value;
  await getDataFromIndexedDB(user);

  let payload = {
    user: user
  };
  if(USER_KEY) {
    postDataToUrl("/signin", payload);
    // 1. decrypt response with private key
    // 2. encrypt response with server key
    payload.response = "CLIENT RE-ENCRYPTS SECRET";
    console.log(payload);
    postDataToUrl("/signin/verify", payload);
  } else {
    console.log("User key not found");
  }
}

async function postDataToUrl(url, data) {
  axios.post(url, data)
    .then(function(res) {
      serverResponse = res.data;
      console.log(serverResponse);
    })
    .catch(function(err) {
      // SILENTLY FAIL
      return;
    });
}

// Function to grab key from indexedDB
async function getDataFromIndexedDB(id) {
  let conn;
  try {
    conn = await connectIndexedDB("PictorStore", "keys", 1);
    USER_KEY = await getDataIndexedDB(conn, "keys", id);
  } catch(exception) {
    console.log(exception);
  } finally {
    if(conn)
      conn.close();
  }
}
