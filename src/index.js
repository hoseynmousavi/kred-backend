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
import viewRouter from "./routes/viewRouter"
import videoPackRouter from "./routes/videoPackRouter"
import videoRouter from "./routes/videoRouter"
import companyRouter from "./routes/companyRouter"
import videoPackCategoryRouter from "./routes/videoPackCategoryRouter"
import verificationCodeRouter from "./routes/verificationCodeRouter"
import videoController from "./controllers/videoController"
import videoPackCategoryController from "./controllers/videoPackCategoryController"
import videoPackController from "./controllers/videoPackController"
import buyVideoPackRouter from "./routes/buyVideoPackRouter"

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
        res.sendFile(path.join(__dirname, `/subtitles/${req.params.file}`))
    }
    else
    {
        const subtitleUrl = `/subtitles/${req.params.file}`
        videoController.getVideoBySubtitleUrl({subtitleUrl})
            .then((resultVideo) =>
            {
                videoPackCategoryController.getVideoPackCategoryByVideo({videoPackCategoryId: resultVideo.video.video_pack_category_id})
                    .then((resultCategory) =>
                    {
                        videoPackController.getPermissionsFunc({condition: {user_id: req.headers.authorization._id, video_pack_id: resultCategory.videoPackCategory.video_pack_id}})
                            .then((resultPermission) =>
                            {
                                if (resultPermission.relations && resultPermission.relations.length > 0) res.sendFile(path.join(__dirname, `/subtitles/${req.params.file}`))
                                else
                                {
                                    if (resultVideo.video.is_free) res.status(202).sendFile(path.join(__dirname, `/subtitles/${req.params.file}`))
                                    else res.status(403).send({message: "don't have permission"})
                                }
                            })
                            .catch((result) => res.status(result.status || 500).send(result.err))
                    })
                    .catch((result) => res.status(result.status || 500).send(result.err))
            })
            .catch((result) => res.status(result.status || 500).send(result.err))
    }
})

notFoundRooter(app) // & at the end

// Eventually Run The Server
app.listen(data.port, () => console.log(`Kred Backend is Now Running on Port ${data.port}`))