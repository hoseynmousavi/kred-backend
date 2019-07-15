import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import data from './src/data'

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
import rootRouter from './src/routes/rootRouter'
import userRouter from './src/routes/userRouter'

rootRouter(app)
userRouter(app)

// Eventually Run The Server
app.listen(process.env.PORT || data.port, () => console.log(`Kred Backend is Now Running on Port ${data.port}`))