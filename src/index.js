import cors from "cors"
import express from "express"
import bodyParser from "body-parser"
import fileUpload from "express-fileupload"
import mongoose from "mongoose"
import rootRouter from "./routes/rootRouter"
import userRouter from "./routes/userRouter"
import datePickerRouter from "./routes/datePickerRouter"
import data from "./data"
import notFoundRooter from "./routes/notFoundRouter"
import addHeaderAndCheckPermissions from "./functions/addHeaderAndCheckPermissions"
import exchangeRouter from "./routes/exchangeRouter"
import cityRouter from "./routes/cityRouter"
import categoryRouter from "./routes/categoryRouter"
import conversationRouter from "./routes/conversationRouter"
import viewRouter from "./routes/viewRouter"
import videoPackRouter from "./routes/videoPackRouter"
import videoRouter from "./routes/videoRouter"
import companyRouter from "./routes/companyRouter"
import videoPackCategoryRouter from "./routes/videoPackCategoryRouter"
import verificationCodeRouter from "./routes/verificationCodeRouter"
import buyVideoPackRouter from "./routes/buyVideoPackRouter"
import offCodeRouter from "./routes/offCodeRouter"
import mailRouter from "./routes/mailRouter"
import fileRouter from "./routes/fileRouter"
import notificationRouter from "./routes/notificationRouter"
import classRouter from "./routes/classRouter"
import siteMapRouter from "./routes/siteMapRouter"

// Normal Things Never Leave Us Alone ...
const app = express()
app.use(cors())
app.use(fileUpload({createParentPath: true}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Connecting To DB (data file is private babes 😊)
mongoose.Promise = global.Promise
mongoose.connect(data.connectServerDb, {useNewUrlParser: true}).then(() => console.log("connected to db"))

// Add Header To All Responses & Token Things
addHeaderAndCheckPermissions(app)

// Routing Shits
rootRouter(app)
userRouter(app)
datePickerRouter(app)
exchangeRouter(app)
cityRouter(app)
categoryRouter(app)
conversationRouter(app)
viewRouter(app)
videoPackRouter(app)
videoRouter(app)
companyRouter(app)
videoPackCategoryRouter(app)
buyVideoPackRouter(app)
verificationCodeRouter(app)
offCodeRouter(app)
mailRouter(app)
notificationRouter(app)
classRouter(app)
fileRouter(app, __dirname)
siteMapRouter(app, __dirname)
notFoundRooter(app) // & at the end

// Eventually Run The Server
app.listen(data.port, () => console.log(`Kred Backend is Now Running on Port ${data.port}`))