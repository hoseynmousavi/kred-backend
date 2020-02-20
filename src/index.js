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
import categoryRouter from "./routes/categoryRouter"
import conversationRouter from "./routes/conversationRouter"
import packPermissionController from "./controllers/packPermissionController"
import viewRouter from "./routes/viewRouter"
import videoPackRouter from "./routes/videoPackRouter"
import videoRouter from "./routes/videoRouter"
import companyRouter from "./routes/companyRouter"
import videoPackCategoryRouter from "./routes/videoPackCategoryRouter"
import verificationCodeRouter from "./routes/verificationCodeRouter"

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
verificationCodeRouter(app)

app.route("/media/:folder/:file").get((req, res) =>
{
    res.setHeader("Cache-Control", "max-age=31536000")
    res.sendFile(path.join(__dirname, `/media/${req.params.folder}/${req.params.file}`))
})

app.route("/videos/:file").get((req, res) =>
{
    res.setHeader("Cache-Control", "max-age=31536000")
    res.sendFile(path.join(__dirname, `/videos/${req.params.file}`))
})

app.route("/subtitles/:file").get((req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        res.setHeader("Cache-Control", "max-age=31536000")
        res.sendFile(path.join(__dirname, `/subtitles/${req.params.file}`))
    }
    else
    {
        packPermissionController.checkPermission(
            req.headers.authorization.phone,
            (errCode) =>
            {
                if (
                    req.params.file === "Superior view of base of the skull" ||
                    req.params.file === "Inferior view of base of the skull" ||
                    req.params.file === "Superficial nerves of the head" ||
                    req.params.file === "Cervical plexus"
                )
                {
                    res.setHeader("Cache-Control", "max-age=31536000")
                    res.status(202).sendFile(path.join(__dirname, `/subtitles/${req.params.file}`))
                }
                else res.status(errCode).send({message: "don't have permission"})
            },
            () =>
            {
                res.setHeader("Cache-Control", "max-age=31536000")
                res.sendFile(path.join(__dirname, `/subtitles/${req.params.file}`))
            },
        )
    }
})

notFoundRooter(app) // & at the end

// Eventually Run The Server
app.listen(data.port, () => console.log(`Kred Backend is Now Running on Port ${data.port}`))