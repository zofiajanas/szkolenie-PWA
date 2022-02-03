const dbPromise = idb.open('posts-store', 1, db => {
  // funkcja wykona się na każdym razem gdy db będzie twrzona
  if (!db.objectStoreNames.contains('posts')) {
    db.createObjectStore('posts', { keyPath: 'id' });
  }
});

const writeData = (storeName, data) => {
  return dbPromise.then(db => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    console.log(store, data);
    store.put(data);
    return tx.complete;
  });
};

const readAllData = storeName => {
  return dbPromise.then(db => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    return store.getAll();
  });
};

const clearAllData = storeName => {
  return dbPromise.then(db => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.clear();
    return tx.complete;
  });
};

const deleteItemFromData = (storeName, idItem) => {
  dbPromise.then(db => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.delete(idItem);
    return tx.complete;
  });
};
