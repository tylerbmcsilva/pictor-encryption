async function createAndStoreKey() {
  let keys = await keyGen();
  let conn;
  try {
    conn = await connect("PictorStore", "keys", 1);
    await storeData(conn, "keys", keys);
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
      let store = db.createObjectStore(objectStoreName, {autoIncrement:true});
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
