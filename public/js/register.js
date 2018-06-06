
async function main(window, document) {
  // const SERVER_KEY = await getServerPublicKey();
  // Function to grab info from form
  document.getElementById("register_form").addEventListener("submit", handleRegisterSubmit);


  async function handleRegisterSubmit(event) {
    event.preventDefault();
    showePreloader();

    const firstName = document.getElementById('first_name').value;
    const lastName  = document.getElementById('last_name').value;
    const email     = document.getElementById('email').value;
    const location  = document.getElementById('location').value;
    const password  = document.getElementById('password_register').value;
    if(validateFormEntries(firstName, lastName, email, password) === false) {
      hidePreloader();
      return;
    }

    // Create both Keypair and CipherKey
    let keys = await createKeys();
    // Store KeyPair in IndexedDB
    await storeKeysInIndexedDB(keys, email);
    // Export key in PEM format
    let pem = await exportRSAKeyToPEM(keys.pair.publicKey);

    //console.log("PEM formatted USER_KEY");
    //console.log(pem);

    let data = {
      first_name: firstName,
      last_name:  lastName,
      email:      email,
      location:   location,
      password:   password,
      public_key: pem
    };

    // let payload = await encryptUsingRSA(SERVER_KEY, stringToByteArray(data));


    // Encrypt payload with server public key
    // POST data from form
    const response = await postDataToUrl("/api/user", data);
    window.location.pathname = "/feed";
  }


  function validateFormEntries(firstName, lastName, email, password) {
    if(firstName && lastName && email && password)
      return true;
    else
      return false;
  }


  async function exportRSAKeyToPEM(key) {
    let keydata = await window.crypto.subtle.exportKey('spki', key);
    return spkiToPEM(keydata);
  }


  function spkiToPEM(keydata){
      let keydataS      = arrayBufferToString(keydata);
      let keydataB64    = window.btoa(keydataS);
      let keydataB64Pem = formatAsPem(keydataB64);

      return keydataB64Pem;
  }


  function arrayBufferToString(buffer) {
      let binary  = "";
      let bytes   = new Uint8Array(buffer);
      let length  = bytes.byteLength;

      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode( bytes[i] );
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


  // Function to grab key from indexedDB
  async function getDataFromIndexedDB(id) {
    let conn;
    try {
      conn  = await connectIndexedDB("PictorStore", "keys", 1);
      return await getDataIndexedDB(conn, "keys", id);
    } catch(exception) {
      console.log(exception);
    } finally {
      if(conn)
        conn.close();
    }
  }


}

!function(w,d) {
  d.addEventListener('DOMContentLoaded', main(w,d));
  hidePreloader();
  M.AutoInit();
}(window, document);
