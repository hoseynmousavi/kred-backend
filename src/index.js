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
import path from "path"

// Normal Things Never Leave Us Alone ...
const app = express()
app.use(cors())
app.use(fileUpload({}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Connecting To DB (data file is private babes 😊)
mongoose.Promise = global.Promise
mongoose.connect(data.connectServerDb, {useNewUrlParser: true})

// Add Header To All Responses & Token Things
addHeaderAndCheckPermissions(app)

// Routing Shits
rootRouter(app)
userRouter(app)
datePickerRouter(app)
exchangeRouter(app)
cityRouter(app)

app.route("/media/:folder/:file").get((req, res) =>
{
    res.setHeader("Cache-Control", "max-age=31536000")
    res.sendFile(path.join(__dirname, `/media/${req.params.folder}/${req.params.file}`))
})

notFoundRooter(app) // & at the end

// Eventually Run The Server
app.listen(data.port, () => console.log(`Kred Backend is Now Running on Port ${data.port}`))