/* define XMLHttpRequest */
var DBOpenRequest = window.indexedDB.open('pwa-cache', 0.1)
var db
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js', {scope: '/dist/'})
    .then(function (reg) {
      console.log('reg worked here ', reg.scope)
    }).catch(function (err) {
      console.error('reg errored out with ', err)
    })
}

this.addEventListener('install', function (event) {
  event.waitUntil(openAndReadFromDB)
})

DBOpenRequest.onerror = function (event) {
  console.error('event errored: ', event.error)
}

DBOpenRequest.onsuccess = function (event) {
  console.log('success')
  db = event.target.result
  console.log('db is ', db)
}

DBOpenRequest.onupgradeneeded = function (event) {
  db = event.target.result
  console.log('needed ')

  var objectStore = db.createObjectStore('caches', {
    keyPath: 'filePath'
  })

  objectStore.createIndex('fileName', 'fileName', { unique: true })
  objectStore.createIndex('img', 'img', { unique: true })
  objectStore.transaction.oncomplete = function (event) {
    var filesObjectStore = db
      .transaction('cacheFiles', 'readwrite')
      .objectStore('cacheFiles')

    getFileBlob('index.html').then(function (data) {
      console.log('data', data)
      filesObjectStore.add({'index.html': data})
    })
  }
}

function createObjectStore (db, storeName) {
  db.createObjectStore(storename, { keyPath: 'filePath' })
  return db
}

function openAndReadFromDB () {
  // IDB stuff
}

function getFileBlob (filePath) {
  return new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest()
    req.open('GET', filePath)
    req.responseType = 'blob'

    req.onload = function () {
      if (req.status === 200) {
        resolve(req.response)
      } else {
        reject(new Error('error loading: ' + req.statusText))
      }
    }

    req.onerror = function () {
      reject(Error('error in request'))
    }

    req.send()
  })
}

