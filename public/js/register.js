// on load, receive server public key
// let serverKey = ...;

let USER_KEY;
let USER_KEY_TO_PEM;

// Function to grab info from form
document.getElementById("registerbutton").addEventListener("click", sendRegisterForm);

async function sendRegisterForm(e) {
  e.preventDefault();

  let firstName =  document.getElementById("first_name").value;
  let lastName =  document.getElementById("last_name").value;
  let email =  document.getElementById("email_register").value;
  await createAndStoreKeys(email);
  await getDataFromIndexedDB(email);
  await exportRSAKeyToPEM(USER_KEY.publicKey);
  console.log("PEM formatted USER_KEY");
  console.log(USER_KEY_TO_PEM);
  console.log("Email");
  console.log(email);
  let payload = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    key: USER_KEY_TO_PEM
  };

  // Encrypt payload with server public key
  // POST data from form
  postDataToUrl("/api/user/new", payload);
}

function exportRSAKeyToPEM(key) {
  return window.crypto.subtle.exportKey(
      "spki",
      key
  ).then(function(keydata) {
    USER_KEY_TO_PEM = spkiToPEM(keydata);
  }).catch(function(err){
    console.error(err);
  });
}

function spkiToPEM(keydata){
    let keydataS = arrayBufferToString(keydata);
    let keydataB64 = window.btoa(keydataS);
    let keydataB64Pem = formatAsPem(keydataB64);
    return keydataB64Pem;
}

function arrayBufferToString(buffer) {
    let binary = "";
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return binary;
}


function formatAsPem(str) {
    let finalString = "-----BEGIN PUBLIC KEY-----\n";

    while(str.length > 0) {
        finalString += str.substring(0, 64) + "\n";
        str = str.substring(64);
    }

    finalString += "-----END PUBLIC KEY-----";

    return finalString;
}

function postDataToUrl(url, data) {
  axios.post(url, data)
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
