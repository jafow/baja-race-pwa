var express = require('express')
var exphbs = require('express-handlebars')
var path = require('path')
var messageController = require('./server/message-controller')
var appController = require('./server/app-controller')
var bodyParser = require('body-parser')
// var uri = `postgresql://jaredfowler:${dbkey}@localhost/jaredfowler`
const PORT = process.env.PORT || 3001
var app = express()
var hbs = exphbs.create({
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, 'views/partials'),
  layoutsDir: path.join(__dirname, 'views/layouts'),
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: false }))
app.get('/', appController.get, (req, res) => {
  res.render('home', req.body)
})

app.get('/racer', (req, res) => {

})

app.get('/rm', (req, res) => {
  res.render('rm', req.body.renderData)
})

app.get('/latest', (req, res) => {
  Pool.query(`SELECT message from race_messages
      ORDER BY time_received
      DESC
      LIMIT 1`
      , (err, data) => {
    if (err) {
      res.status(400).send(err)
    } else {
      res.send(data.rows[0].message)
    }
  })
})

app.post('/sat', messageController.parse, (req, res) => {
  var raceMile = req.body.Body
  var msgCode = Number(req.body.SmsSid.substring(0, 9))
  var d = formatDateString(new Date())

  Pool.query(`INSERT into race_messages
      (code, "message", "time_received")
      VALUES ($1, $2, $3)`, [msgCode, raceMile, d],
      function (err, result) {
        if (err) {
          console.error(err)
          return res.status(404).send(err)
        }
        res.status(200).send('ok\n')
      }
  )
})

app.listen(PORT, () => console.log(`listening ${PORT}`))

function formatDateString (dateObj) {
  var d = dateObj || new Date()
  var ymd = `${(d.getYear()) + 1900}-${(d.getMonth()) + 1}-${(d.getDate())}`
  var time = `${(d.getHours())}:${d.getMinutes() + 10}:${d.getSeconds()}`
  return `${ymd} ${time}`
}
