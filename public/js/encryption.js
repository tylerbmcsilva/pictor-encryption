//  test data - temporary
// const testEmail = "harrypotter@gmail.com";
// const testData = {
//   id: 1,
//   name:     'Harry Potter',
//   location: {
//     city:   'New York City',
//     state:  'New York'
//   }
// }
//
//  argument used to search IndexedDB record
// let id = testEmail;

async function createAndStoreKeys(id) {
  let keyPair = await generateRSAKeyPair();
  let cipherKey = await generateAESKey();

  try {
    conn = await connectIndexedDB("PictorStore", "keys", 1);
    let data = {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
      id: id // temporary
    };
    await storeDataIndexedDB(conn, "keys", data);
  } catch (exception) {
    console.error(exception);
  } finally {
    if (conn)
      conn.close();
  }
}

async function createKeys() {
  let keyPair   = await generateRSAKeyPair();
  let cipherKey = await generateAESKey();

  return {pair: keyPair, cipher: cipherKey}
}

async function storeKeysInIndexedDB(keys, id) {
  let conn;

  try {
    conn = await connectIndexedDB("PictorStore", "keys", 1);
    let data = {
      publicKey: keys.pair.publicKey,
      privateKey: keys.pair.privateKey,
      id: id // temporary
    };
    await storeDataIndexedDB(conn, "keys", data);
  } catch (exception) {
    console.error(exception);
  } finally {
    if (conn)
      conn.close();
    }
  }

// stores public key of the user in the database
async function storePublicKeyDB(id, pubKey) {
  // currently we're using test id
  id = testData.id.toString();
  try {
    const response = await axios.get('/store?userId=' + id + '&publicKey=' + pubKey)
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

// Creates a new RSA key pair and returns it
async function generateRSAKeyPair() {
  return await window.crypto.subtle.generateKey({
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: {
      name: "SHA-256"
    }
  }, true, ["encrypt", "decrypt"]);
}

// Creates a new  AES-CBC 256 bit cipher key and returns it
async function generateAESKey() {
  return await window.crypto.subtle.generateKey({
    name: "AES-CBC",
    length: 256
  }, true, ["encrypt", "decrypt"]);
}


// for testing generation and storage of servers key Pair
// **********************
// EVENTUALLY REMOVE
// **********************
// function generateServerKeyPair() {
//   return axios.post("/api/server/create-store-keys").then(function(r) {
//     if (r.status === 404)
//       throw new Error(404);
//     else
//       return console.log(r.data.message);
//     }
//   ).catch(function(err) {
//     // SILENTLY FAIL
//     // console.log(err);
//     return;
//   });
// }


// for retrieval of servers public key
// **********************
// EVENTUALLY REMOVE SEND IN PAYLOAD
// **********************
// async function getServerPublicKey() {
//   try {
//     const res = await axios.get("/api/server/public-key");
//     if (res.status === 404)
//       throw error;

//     const SPK = res.data.publicKey.replace(/(-{5}.+-{5})|(\n+)/gm, '');

//     const publicKeyByteArray = base64ToByteArray(SPK);

//     let publicKey = await window.crypto.subtle.importKey('raw',
//       publicKeyByteArray,
//       {
//         name: "RSA-OAEP",
//         hash: { name: "SHA-256" },
//       },
//       false,
//       ['verify', 'encrypt']
//     );

//     return publicKey;
//   } catch (error) {
//     console.error(error);
//   };
// }


async function connectIndexedDB(dbName, objectStoreName, version) {
  return await new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, version);
    request.onupgradeneeded = () => {
      let db = request.result;
      let store = db.createObjectStore(objectStoreName, {keyPath: "id"}); // keyPath may change later
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => {
      console.log('blocked');
    };
  });
}


async function storeDataIndexedDB(conn, objectStoreName, data) {
  return await new Promise((resolve, reject) => {
    const tx = conn.transaction(objectStoreName, "readwrite");
    const store = tx.objectStore(objectStoreName);
    const request = store.put(data);
    request.onsuccess = () => resolve(request.result);
    request.error = () => reject(request.error);
  });
}


async function getDataIndexedDB(conn, objectStoreName, value) {
  return await new Promise((resolve, reject) => {
    const tx      = conn.transaction(objectStoreName, "readonly");
    const store   = tx.objectStore(objectStoreName);
    const request = store.get(value);
    request.onsuccess = () => resolve(request.result);
    request.error = () => reject(request.error);
  });
}


// for encrypting json blocks
async function encryptJSON(data, id) {
  let conn;

  try {
    conn = await connectIndexedDB("PictorStore", "keys", 1);

    let key = await getDataIndexedDB(conn, "keys", id);
    let uint8array = new TextEncoder("utf-8").encode(JSON.stringify(data));
    let encData = await encryptUsingRSA(key.publicKey, uint8array);

    return encData;
  } catch (exception) {
    console.error(exception);
  } finally {
    if (conn)
      conn.close();
    }
  }


// for decrypting json blocks
async function decryptJSON(data, id) {
  let conn;

  try {
    conn = await connectIndexedDB("PictorStore", "keys", 1);

    let keys = await getDataIndexedDB(conn, "keys", id);
    let uint8array = await decryptUsingRSA(keys.privateKey, stringToByteArray(data));
    let decryptedData = new TextDecoder("utf-8").decode(uint8array);

    return decryptedData;
  } catch (exception) {
    console.error(exception);
  } finally {
    if (conn)
      conn.close();
  }
}


async function encryptUsingRSA(key, data) {
  console.log('encrypting')
  return await window.crypto.subtle.encrypt({
    name: "RSA-OAEP",
    hash: {
      name: "SHA-256"
    }
  }, key, data);
}


async function decryptUsingRSA(key, data) {
  console.log('decrypting')
  try {
    let r = await window.crypto.subtle.decrypt({
      name: "RSA-OAEP",
      hash: {
        name: "SHA-256"
      }
    }, key, data);
    return r;
  } catch (e) {
    console.error(e);
  }
}

async function exportRSAKeyToPEM(key) {
  return await window.crypto.subtle.exportKey(
      'spki',
      key
  ).then(function(keydata) {
    return spkiToPEM(keydata);
  }).catch(function(err){
    console.error(err);
  });
}


function spkiToPEM(keydata){
  let keydataS      = arrayBufferToString(keydata);
  let keydataB64    = window.btoa(keydataS);
  let keydataB64Pem = formatAsPem(keydataB64);
  return keydataB64Pem;
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


function arrayBufferToString(buffer) {
  let binary = "";
  let bytes = new Uint8Array(buffer);
  let length = bytes.byteLength;
  for (let i = 0; i < length; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return binary;
}


async function sendPayloadToServer(url, payload) {
  const serverKey = await getServerPublicKey();
}
