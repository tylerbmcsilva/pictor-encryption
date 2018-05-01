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
  let conn;
  try {
    conn = await connect("PictorStore", "keys", 1);
    let data = {
      publicKey:  keyPair.publicKey,
      privateKey: keyPair.privateKey,
      id:      id   // temporary
    };
    await storeData(conn, "keys", data);
  } catch(exception) {
    console.error(exception);
  } finally {
    if(conn)
      conn.close();
  }
}

function keyGenRSA() {
  return window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: {name: "SHA-256"}
    },
    false,
    ["encrypt", "decrypt"]
  )
  .then((key) => {
    return key;
  });
}

function connect(dbName, objectStoreName, version) {
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

function storeData(conn, objectStoreName, data) {
  return new Promise((resolve, reject) => {
    const tx = conn.transaction(objectStoreName, "readwrite");
    const store = tx.objectStore(objectStoreName);
    const request = store.put(data);
    request.onsuccess = () => resolve(request.result);
    request.error = () => reject(request.error);
  });
}

function getData(conn, objectStoreName, value) {
  return new Promise((resolve, reject) => {
    const tx = conn.transaction(objectStoreName, "readonly");
    const store = tx.objectStore(objectStoreName);
    const request = store.get(value);
    request.onsuccess = () => resolve(request.result);
    request.error = () => reject(request.error);
  });
}

// for encrypting json blocks
async function encryptData(data, id) {
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