async function createAndStoreKeyPair() {
  let keyPair = await keyGen();
  let conn;
  let email = "harrypotter@gmail.com";
  try {
    conn = await connect("PictorStore", "keys", 1);
    let data = {
      publicKey:  keyPair.publicKey,
      privateKey: keyPair.privateKey,
      email:      email
    };
    await storeData(conn, "keys", data);
  } catch(exception) {
    console.error(exception);
  } finally {
    if(conn)
      conn.close();
  }
}

function keyGen() {
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
}

function connect(dbName, objectStoreName, version) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, version);   request.onupgradeneeded = () => {
      let db = request.result;
      let store = db.createObjectStore(objectStoreName, {keyPath: "email"});
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


testData = {
  id: 1,
  name:     'Harry Potter',
  location: {
    city:   'New York City',
    state:  'New York'
  }
}

async function encryptData(data) {
  let conn;
  let key;
  let email = "harrypotter@gmail.com";
  try {
    conn = await connect("PictorStore", "keys", 1);
    let key = await getData(conn, "keys", email);
    let uint8array = new TextEncoder("utf-8").encode(JSON.stringify(data));
    let encryptedData = await encrypt(key.privateKey, uint8array);
    console.log(encryptedData);
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

function decrypt(key, data) {
  return window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    key,
    data
  )
}
