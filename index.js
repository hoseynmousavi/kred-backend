const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const data = require('./Data/data')

// Normal Things Never Leave Us Alone ...
const app = express()
app.use(cors())
app.use(fileUpload({}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Add Header To All Responses
app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*')
    next()
})

// Routing Shits
const Root = require('./Routers/Root')
app.use('/', Root)

// Eventually Run The Server
app.listen(process.env.PORT || data.port, () => console.log(`Kred Backend is Now Running on Port ${data.port}`))