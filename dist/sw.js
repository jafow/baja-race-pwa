/* define XMLHttpRequest */
var DBOpenRequest = window.indexedDB.open('pwa-cache', 1.0)
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
  db = event.target.result
  var t = db.transaction(['myFiles'], 'readwrite')
  var obStore = t.objectStore('myFiles')

  getFileBlob('/').then(function (data) {
    console.log('adding data', data)
    obStore.add({'index': data})
  })
}

DBOpenRequest.onupgradeneeded = function (event) {
  db = event.target.result

  var objectStore = createObjectStore(db, 'myFiles')
  objectStore.createIndex('img', 'img', { unique: true })
  objectStore.createIndex('html', 'html', { unique: true })
  objectStore.transaction.oncomplete = function (event) {
    var filesObjectStore = db
      .transaction('myFiles', 'readwrite')
      .objectStore('myFiles')

    getFileBlob('images/128px-Pallas_Cat.jpg').then(function (data) {
      filesObjectStore.add({'images/128px-Pallas_Cat.jpg': data})
    })
  }
}

function createObjectStore (db, storeName) {
  return db.createObjectStore(storeName, { keyPath: 'filePath' })
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

