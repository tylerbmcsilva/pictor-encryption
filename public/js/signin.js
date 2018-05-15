
// Function to grab info from form
document.getElementById("login").addEventListener("submit", handleSignInSubmit);

async function handleSignInSubmit(e) {
  e.preventDefault();
  showePreloader();

  const USER_EMAIL  = document.getElementById("email_login").value;
  const USER_KEY    = await getDataFromIndexedDB(USER_EMAIL);

  let payload = {
    user: USER_EMAIL
  };
  if(USER_KEY) {
    let res1 = await postDataToUrl("/signin", payload);
    // 1. decrypt response with private key
    // 2. encrypt response with server key
    let verifyPayload = {
      user:     USER_EMAIL,
      response: "CLIENT RE-ENCRYPTS SECRET"
    }

    let res2 = await postDataToUrl("/signin/verify", verifyPayload);
    if(res2.status === 202)
      window.location.pathname = '/feed';
    else
      window.location.pathname = '/';
  } else {
    console.log("User key not found");
    window.location.pathname = '/';
  }
}

async function postDataToUrl(url, data) {
  return axios.post(url, data)
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
    return await getDataIndexedDB(conn, "keys", id);
  } catch(exception) {
    console.log(exception);
  } finally {
    if(conn)
      conn.close();
  }
}
