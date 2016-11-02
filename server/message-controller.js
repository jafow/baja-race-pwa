const sid = require('../config.json').accountSid
const token = require('../config.json').authToken
const toNumber = require('../config.json').toNumber
const fromNumber = require('../config.json').fromNumber
const twilio = require('twilio')

const client = new twilio.RestClient(sid, token)

const messageController = {
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
  }
}

module.exports = messageController



