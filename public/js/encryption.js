// test data - temporary
const testEmail = "harrypotter@gmail.com";
const testData = {
  id: 1,
  name:     'Harry Potter',
  location: {
    city:   'New York City',
    state:  'New York'
  }
}

// argument used to search IndexedDB record
let id = testEmail;

// to store encrypted and decrypted data
let encryptedData;
let jsonBlock;

async function createAndStoreKeys() {
  let keyPair = await keyGenRSA();
  let cipherKey = await keyGenAES();
  let conn;
  try {
    conn = await connectIndexedDB("PictorStore", "keys", 1);
    let data = {
      publicKey:  keyPair.publicKey,
      privateKey: keyPair.privateKey,
      id:      id   // temporary
    };
    await storeDataIndexedDB(conn, "keys", data);
  } catch(exception) {
    console.error(exception);
  } finally {
    if(conn)
      conn.close();
  }
}

// stores public key of the user in the database
async function storePublicKeyDB(id, pubKey){
  // currently we're using test id
  id = testData.id.toString();
  try{
    const response = await axios.get('/store?userId='+id+'&publicKey='+pubKey)
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}


// Creates a new RSA key pair and returns it
function keyGenRSA() {
  return window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: {name: "SHA-256"}
    },
    true,
    ["encrypt", "decrypt"]
  )
  .then((keys) => {
    //return keys; //original usage
    /******* FOR TESTING ENCRYPTION ***************/
    /*********************************************/
    // source: https://github.com/engelke/fluent2016/blob/master/Solutions/4/lab4.js
    // Export the public key portion
    window.crypto.subtle.exportKey("spki", keys.publicKey
  ).then((spkiBuffer)=> {
      var spkiBytes = new Uint8Array(spkiBuffer);
      var spkiString = byteArrayToBase64(spkiBytes);
      var spkiBox = document.getElementById("publickey");
      spkiBox.value = spkiString;
    }).catch(function(err) {
      alert("Could not export public key: " + err.message);
    });
    // Export the private key part, in parallel to the public key
    window.crypto.subtle.exportKey("pkcs8", keys.privateKey
  ).then((pkcs8Buffer)=> {
      var pkcs8Bytes = new Uint8Array(pkcs8Buffer);
      var pkcs8String = byteArrayToBase64(pkcs8Bytes);
      var pkcs8Box = document.getElementById("privatekey");
      pkcs8Box.value = pkcs8String;
    }).catch((err)=> {
      alert("Could not export private key: " + err.message);
    });
  }).catch((err)=> {
    alert("Could not generate key pair: " + err.message);
  });
  /*******************************************/
}

// Creates a new  AES-CBC 256 bit cipher key and returns it
function keyGenAES(){
  return window.crypto.subtle.generateKey(
    {name: "AES-CBC", length: 256},
    true,
    ["encrypt", "decrypt"]
  ).then((key)=>{
    //return key; //original
    /******* FOR TESTING ENCRYPTION ***************/
    /*********************************************/
    // Export to ArrayBuffer
    return window.crypto.subtle.exportKey(
      "raw",
      key
    );
  }).then(function(buf){
    // Cast to a byte array, place in Key field
    var byteArray = new Uint8Array(buf);
    var keyField = document.getElementById("cipherKey");
    keyField.value = byteArrayToHexString(byteArray);
  });
  /*******************************************/
}

// for testing generation and storage of servers key Pair
function genStoreSKP() {
  return axios.get("/api/genAndStoreSKP")
    .then(function(r){
      if(r.status === 404)
        return {};
      else
        return console.log(r.data.message);
    })
    .catch(function(err){
      // SILENTLY FAIL
      // console.log(err);
      return;
    });
}

// for retrieval of servers public key
function retSPK() {
  return axios.get("/api/getSPK")
    .then(function(r){
      if(r.status === 404)
        return{};
      else{
        var publicKeyPem = r.data.public_key;
        var pksBox = document.getElementById("sPublicKey");
        pksBox.value = publicKeyPem;
        return publicKeyPem;

      }
    })
    .catch(function(err){
      // SILENTLY FAIL
      // console.log(err);
      return;
    });
}


function connectIndexedDB(dbName, objectStoreName, version) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, version);   request.onupgradeneeded = () => {
      let db = request.result;
      let store = db.createObjectStore(objectStoreName, {keyPath: "id"});  // keyPath may change later
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => { console.log('blocked'); };
  });
}


function storeDataIndexedDB(conn, objectStoreName, data) {
  return new Promise((resolve, reject) => {
    const tx = conn.transaction(objectStoreName, "readwrite");
    const store = tx.objectStore(objectStoreName);
    const request = store.put(data);
    request.onsuccess = () => resolve(request.result);
    request.error = () => reject(request.error);
  });
}

function getDataIndexedDB(conn, objectStoreName, value) {
  return new Promise((resolve, reject) => {
    const tx = conn.transaction(objectStoreName, "readonly");
    const store = tx.objectStore(objectStoreName);
    const request = store.get(value);
    request.onsuccess = () => resolve(request.result);
    request.error = () => reject(request.error);
  });
}

// for encrypting json blocks
async function encryptJSON(data, id) {
  let conn;
  try {
    conn = await connect("PictorStore", "keys", 1);
    let key = await getData(conn, "keys", id);
    let uint8array = new TextEncoder("utf-8").encode(JSON.stringify(data));
    encryptedData = await encrypt(key.publicKey, uint8array);
  } catch(exception) {
    console.error(exception);
  } finally {
    if(conn)
      conn.close();
  }
}

function encrypt(key, data) {
  return window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    key,
    data
  )
}

// for decrypting json blocks
async function decryptData(data, id) {
  let conn;
  try {
    conn = await connect("PictorStore", "keys", 1);
    let key = await getData(conn, "keys", id);
    let uint8array = await decrypt(key.privateKey, data);
    let decryptedData = new TextDecoder("utf-8").decode(uint8array);
    jsonblock = JSON.parse(decryptedData);
  } catch(exception) {
    console.error(exception);
  } finally {
    if(conn)
      conn.close();
  }
}

function decrypt(key, data) {
  return window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    key,
    data
  )
}

function saySomething(){
  console.log("SOMETHING");
}
