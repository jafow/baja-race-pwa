var express = require('express')
var exphbs = require('express-handlebars')
var path = require('path')
var fs = require('fs')
var MessageController = require('./server/message-controller')
var DbController = require('./server/db-controller')
var bodyParser = require('body-parser')
const PORT = process.env.PORT || 3001
var app = express()
var dbCtrl = new DbController()
var msgCtrl = new MessageController()
var hbs = exphbs.create({
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, 'views/partials'),
  layoutsDir: path.join(__dirname, 'views/layouts')
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', express.static(path.join(__dirname, './dist')))

app.get('/', dbCtrl.get, (req, res) => {
  var body = req.body.lastUpdate
  // read file
  fs.readFile(path.join(__dirname, '/dist/styles/main.css'), (err, contents) => {
    if (err) res.render('error', err)
    var data = {
      inlineStyles: contents,
      rm: body.race_mile,
      mph: body.mph,
      lastSeen: body.last_seen,
      updateTime: body.update_time
    }
    res.render('home', data)
  })
})

app.post('/sat', msgCtrl.parse, dbCtrl.set, (req, res) => {
  res.status(200).send('ok\n')
})

app.listen(PORT, () => console.log(`listening ${PORT}`))


