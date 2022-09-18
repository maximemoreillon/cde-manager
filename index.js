const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const db = require('./db')
const { version, author } = require('./package.json')

dotenv.config()

const app = express()

const {
    EXPRESS_PORT = 80,
} = process.env

db.connect()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send({
        application_name: 'CDE manager API',
        author,
        version,
        // databases: {
        //     mongodb: { url: mongodb_url, db: mongodb_db },
        //     influxdb: { url: influxdb_url, db: influxdb_db },
        // },
        // auth: {
        //     identification_url: IDENTIFICATION_URL,
        //     group_auth: {
        //         url: GROUP_AUTHORIZATION_URL,
        //         groups: AUTHORIZED_GROUPS
        //     }
        // }
    })
})

app.use('/pods', require('./routes/pods.js'))




app.listen(EXPRESS_PORT, () => { console.log(`[Express] CDE manager API listening on *:${EXPRESS_PORT}`) })


