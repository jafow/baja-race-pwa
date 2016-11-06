const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const Pg = require('pg').Pool
const messageController = require('./server/message-controller')
const bodyParser = require('body-parser')
// const uri = `postgresql://jaredfowler:${dbkey}@localhost/jaredfowler`
const PORT = process.env.PORT || 3001
const app = express()
const dbConfig = {
  host: 'localhost',
  user: 'jaredfowler',
  password: 'hubba0k0',
  database: 'jaredfowler',
  max: 8,
  idleTimeoutMillis: 28000
}
const Pool = new Pg(dbConfig)
const hbs = exphbs.create({
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, 'views/partials'),
  layoutsDir: path.join(__dirname, 'views/layouts'),
})

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/racer', (req, res) => {
  res.render('racer')
})

app.get('/rm', (req, res) => {
  res.render('rm')
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

app.post('/sat', (req, res) => {
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
