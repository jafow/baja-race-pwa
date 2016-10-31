const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, 'views/partials'),
  layoutsDir: path.join(__dirname, 'views/layouts'),
})

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/racer', (req, res) => {
  res.render('racer')
})

app.get('/rm', (req, res) => {
  res.render('rm')
})
app.listen(3001)

