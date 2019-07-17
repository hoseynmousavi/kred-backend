import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import mongoose from 'mongoose'
import rootRouter from './routes/rootRouter'
import userRouter from './routes/userRouter'
import data from './data'

// Normal Things Never Leave Us Alone ...
const app = express()
app.use(cors())
app.use(fileUpload({}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

mongoose.Promise = global.Promise
// mongoose.connect('mongodb://seyed_hoseyn:HH123456hh@localhost:27017/kred', {useNewUrlParser: true})
mongoose.connect('mongodb://seyed_hoseyn_kred:HHH123456hhh@188.212.22.166:27017/kred', {useNewUrlParser: true})

// Add Header To All Responses
app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*')
    next()
})

// Routing Shits
rootRouter(app)
userRouter(app)

// Eventually Run The Server
app.listen(data.port, () => console.log(`Kred Backend is Now Running on Port ${data.port}`))