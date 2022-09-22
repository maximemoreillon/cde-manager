const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const auth = require('@moreillon/express_identification_middleware')
const config = require('./config')

const { version, author } = require('./package.json')

dotenv.config()

const app = express()

const {
    EXPRESS_PORT = 80,
    IDENTIFICATION_URL,
} = process.env


app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send({
        application_name: 'CDE manager API',
        author,
        version,
        config,
        auth: {
            identification_url: IDENTIFICATION_URL,
        }
    })
})

if (IDENTIFICATION_URL) app.use(auth({ url: IDENTIFICATION_URL }))



app.use('/environments', require('./routes/environments.js')) // alias




app.listen(EXPRESS_PORT, () => { console.log(`[Express] CDE manager API listening on *:${EXPRESS_PORT}`) })


