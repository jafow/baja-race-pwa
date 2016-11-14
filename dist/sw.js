var DBOpenRequst = window.indexedDB.open('myCache', 1)
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

DBOpenRequst.onerror = function (event) {
  console.error('event errored: ', event.error)
}

DBOpenRequst.onsuccess = function (event) {
  console.log('success')

  db = event.target
}

function openAndReadFromDB () {
  // IDB stuff
}
