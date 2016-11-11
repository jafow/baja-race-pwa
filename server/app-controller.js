const Pg = require('pg').Pool
const config = require('./../config.json')
const tableName = config.table
const dbpw = config.dbpw
const dbConfig = {
  host: 'localhost',
  user: 'jaredfowler',
  password: dbpw,
  database: 'jaredfowler',
  max: 8,
  idleTimeoutMillis: 28000
}
const Pool = new Pg(dbConfig)


const appController = function () {
  var pickFrom = function getFrom (obj) {
    return function (keyName) {
      return obj[keyName]
    }
  }

  return {
    get(req, res, next) {
      Pool.query(`SELECT message from race_messages
          ORDER BY time_received
          DESC
          LIMIT 1`
          , function (err, data) {
        if (err) {
          console.error(err)
          res.status(400).render('error',  {data: err})
        }
        req.body.lastUpate = data.rows[0].message
        next()
        }
      )
    },
    set(req, res, next) {
      var pickFromBody = pickFrom(req.body)
      // parsedMsg should be attached upstream by msgController
      var parsed = req.body//Object.assign({}, req.body.parsedMsg)
      // console.log('parsed id ', parsed)
      Pool.query(`INSERT into race_messages
          (code, "message", "time_received")
          VALUES ($1, $2, $3)`,
          [parsed.msgCode, parsed.raceMile, parsed.timeStamp, parsed.mph],
          function (err, result) {
            if (err) {
              console.error(err)
              return res.status(400).render('error',  {data: err})
            }
            next()
          }
      )
    }
  }
}

module.exports = appController

