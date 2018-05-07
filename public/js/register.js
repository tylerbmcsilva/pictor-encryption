// on load, receive server public key
// let serverKey = ...;

let key;
let pem;

// Function to grab info from form
document.getElementById('registerbutton').addEventListener('click', sendRegisterForm);

async function sendRegisterForm(e) {
  let firstName =  document.getElementById('first_name').value;
  let lastName =  document.getElementById('last_name').value;
  let email =  document.getElementById('email').value;
  await createAndStoreKeys(email);
  await getDataFromIndexedDB(email);
  await exportRSAKeyToPEM(key.publicKey);
  console.log("PEM");
  console.log(pem);

  let payload = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    key: pem
  };

  // Encrypt payload with server public key
  // POST data from form
  postDataToUrl(e, payload);
}

function exportRSAKeyToPEM(key) {
  return window.crypto.subtle.exportKey(
      "spki",
      key
  ).then(function(keydata) {
    pem = spkiToPEM(keydata);
  }).catch(function(err){
    console.error(err);
  });
}

function spkiToPEM(keydata){
    var keydataS = arrayBufferToString(keydata);
    var keydataB64 = window.btoa(keydataS);
    var keydataB64Pem = formatAsPem(keydataB64);
    return keydataB64Pem;
}

function arrayBufferToString( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return binary;
}


function formatAsPem(str) {
    var finalString = '-----BEGIN PUBLIC KEY-----\n';

    while(str.length > 0) {
        finalString += str.substring(0, 64) + '\n';
        str = str.substring(64);
    }

    finalString = finalString + "-----END PUBLIC KEY-----";

    return finalString;
}

function postDataToUrl(e, data) {
  axios.post('/api/user/new', data)
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
