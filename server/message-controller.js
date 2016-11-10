const sid = require('../config.json').accountSid
const token = require('../config.json').authToken
const toNumber = require('../config.json').toNumber
const fromNumber = require('../config.json').fromNumber
const twilio = require('twilio')

const client = new twilio.RestClient(sid, token)

const messageController = function () {
  var extract = function (str) {
    return function (fn) {
      return fn(str)
    }
  }
  // make 3 regexp helpers that find MPH, time seen, race mile 
  // from the satellite text message
  return {
    createMessage(req, res, next) {
      var myMessage = {
        body: '202',
        to: toNumber,
        from: fromNumber
      }

      client.messages.create(myMessage, (err, msg) => {
        if (err) throw err.message
      })
      next()
    },
    makeData(req, res, next) {
      var body = req.body.race_mile
      req.body.renderData = {
        raceMile: body
      }
      next()
    },
    parse(req, res, next) {
      var msgBody = req.body.Body
      var parsed = {
        msgCode: // get the code
        raceMile: extractRaceMile(msgBody),
        timeStamp: extractTimeStamp

  }
}

module.exports = messageController



