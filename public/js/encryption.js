async function saveKey() {
  let keys = await keyGen();
  console.log(keys);
  storeKey(function(store) {
    store.put({keys: keys});
  })
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

function storeKey(func) {
  let dbName = "PictorStore";
  let objectStoreName = "keys";

  let request = window.indexedDB.open(dbName, 1);

  request.onupgradeneeded = function() {
    let db = request.result;
    let store = db.createObjectStore(objectStoreName, {autoIncrement:true});
  };

  request.onsuccess = function() {
    let db = request.result;
    let transaction = db.transaction(objectStoreName, "readwrite");
    let store = transaction.objectStore(objectStoreName);

    func(store);

    transaction.oncomplete = function() {
      db.close();
    };
  }
}
