const sid = require('../config.json').accountSid
const token = require('../config.json').authToken
const toNumber = require('../config.json').toNumber
const fromNumber = require('../config.json').fromNumber
const twilio = require('twilio')

const client = new twilio.RestClient(sid, token)

function MessageController () {
}

MessageController.prototype.createMessage = function (req, res, next) {
  var myMessage = {
    body: '202',
    to: toNumber,
    from: fromNumber
  }

  client.messages.create(myMessage, (err, msg) => {
    if (err) throw err.message
  })
  next()
}

MessageController.prototype.parse = function (req, res, next) {
  var messageBody = req.body.Body
  var messageBodyList = req.body.Body.split(' ')
  var smssId = req.body.SmsSid
  var stripRM = strip(/RM/)
  var stripEndPd = strip(/\.$/)
  var strippedRaceMile = compose(stripRM, stripEndPd)
  var stripMPH = strip(/MPH/)
  var timeStamp = formatTimeString(messageBodyList[5] + messageBodyList[6])
  var parsed = {
    msgCode: smssId,
    message: messageBody,
    raceMile: Number(strippedRaceMile(messageBodyList[10])),
    mph: Number(stripMPH(messageBodyList[8])),
    lastSeen: `${messageBodyList[4]} ${timeStamp}`,
    updateTime: messageBody.update_time
  }

  req.body.parsed = parsed
  next()
}

function strip (removeRgx) {
  return function (targetString) {
    return targetString.replace(removeRgx, '')
  }
}

function isMorning (timeString) {
  return /AM/.test(timeString)
}

function formatTimeString (timeString) {
  if (isMorning(timeString)) return strip(/AM/)(timeString)
  else {
    var h = Number(timeString.substr(0, 2)) + 12
    var newTimeString = h + timeString.substr(2)
    return strip(/PM/)(newTimeString)
  }
}

function compose (fn1, fn2) {
  return function (args) {
    return fn1(fn2(args))
  }
}

module.exports = MessageController

