import mongoose from "mongoose"
import videoDocumentModel from "../models/videoDocumentModel"
import saveFile from "../functions/saveFile"

const videoDocument = mongoose.model("videoDocument", videoDocumentModel)

const getVideoDocumentsByVideoId = (req, res) =>
{
    const {video_id} = req.params
    videoDocument.find({is_deleted: false, video_id}, "file type description", (err, documents) =>
    {
        if (err) res.status(400).send(err)
        else res.send(documents)
    })
}

const addVideoDocument = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const {video_id, type, description} = req.body
        const file = req.files ? req.files.file : null
        if (video_id && file && type)
        {
            saveFile({file, folder: type === "image" ? "pictures" : "files"})
                .then(file =>
                {
                    const newVideoDocument = new videoDocument({video_id, type, description, file})
                    newVideoDocument.save((err, created) =>
                    {
                        if (err) res.status(400).send(err)
                        else res.send(created)
                    })
                })
                .catch((err) => res.status(400).send(err))
        }
        else res.status(400).send({message: "send video_id && file && type!"})
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const videoDocumentController = {
    getVideoDocumentsByVideoId,
    addVideoDocument,
}

export default videoDocumentController