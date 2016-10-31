const sid = require('../config.json').accountSid
const token = require('../config.json').authToken
const twilio = require('twilio')

const client = new twilio.RestClient(sid, token)

var myMessage = {
  body: 'you are still texting yourself',
  to: 
  from: 
}

client.messages.create(myMessage, (err, msg) => {
  if (err) throw err.message
  console.log('created a message! ', msg)
})

