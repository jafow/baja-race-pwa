const Pg = require('pg').Pool
const config = require('./../config.json')
const tableName = config.tableName
const dbpw = config.dbpw
const dbConfig = {
  host: 'localhost',
  user: 'jaredfowler',
  password: dbpw,
  database: 'jaredfowler',
  max: 4,
  idleTimeoutMillis: 28000
}
const Pool = new Pg(dbConfig)
function DbController () {
}

DbController.prototype.get = function get (req, res, next) {
  Pool.query(`SELECT race_mile, mph, last_seen from ${tableName}
      ORDER BY update_time
      DESC
      LIMIT 1`
      , function (err, data) {
    if (err) {
      res.status(400).render('error', {data: err})
      throw err
    }

    req.body.lastUpate = data.rows[0]
    console.log('body updated is ', req.body.lastUpate)
    next()
  })
}

DbController.prototype.set = function set (req, res, next) {
  var parsed = req.body.parsed
  var message = req.body.Body

  Pool.query(`INSERT into ${tableName}
      ("msg_code", "message", "race_mile", "mph", "last_seen")
      VALUES ($1, $2, $3, $4, $5)`,
      [parsed.msgCode, message, parsed.raceMile, parsed.mph, parsed.lastSeen],
      function (err, result) {
        if (err) {
          console.error(err)
          res.status(400).render('error', {data: err})
        }
        next()
      })
}

module.exports = DbController

