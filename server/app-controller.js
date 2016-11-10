const Pg = require('pg').Pool
const Pool = new Pg(dbConfig)
const dbConfig = {
  host: 'localhost',
  user: 'jaredfowler',
  password: '',
  database: 'jaredfowler',
  max: 8,
  idleTimeoutMillis: 28000
}
const tableName = require('./config.json').table

const appController = function () {
  return {
    get(req, res, next) {
      Pool.query(`SELECT message from race_messages
          ORDER BY time_received
          DESC
          LIMIT 1`
          , function (err, data) => {
        if (err) {
          res.status(400).render('error',  {data: err})
        }
        req.body.lastUpate = data.rows[0].message
        next()
        }
      )
    },
    set(req, res, next) {
      { msgCode, raceMile, timeStamp, mph } = req.body.parsedMsg
      Pool.query(`INSERT into ${tableName}
          (code, "message", "time_received")
          VALUES ($1, $2, $3)`, [msgCode, raceMile, timeStamp, mph],
          function (err, result) {
            if (err) {
              return res.status(400).render('error',  {data: err})
            }
            next()
          }
      )
    }
}

module.exports = appController

