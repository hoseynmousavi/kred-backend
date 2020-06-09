import mongoose from "mongoose"
import videoDocumentModel from "../models/videoDocumentModel"
import saveFile from "../functions/saveFile"
import videoController from "./videoController"

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

const getVideoDocuments = (req, res) =>
{
    if (req.headers.authorization && req.headers.authorization.role === "admin")
    {
        const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 9
        const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
        let query = {is_deleted: false}
        const fields = "video_id file type description created_date"
        const options = {sort: "-created_date", skip, limit}
        videoDocument.find(query, fields, options, (err, documents) =>
        {
            if (err) res.status(400).send(err)
            else
            {
                videoController.getVideosFunc({condition: {is_deleted: false, _id: {$in: documents.reduce((sum, doc) => [...sum, doc.video_id], [])}}, fields: "title"})
                    .then(result =>
                    {
                        const {videos} = result
                        const documentObj = documents.reduce((sum, doc) => ({...sum, [doc._id]: doc.toJSON()}), {})
                        const videosObj = videos.reduce((sum, video) => ({...sum, [video._id]: video.toJSON()}), {})
                        documents.forEach(item =>
                        {
                            documentObj[item._id] = {...documentObj[item._id], video: videosObj[item.video_id]}
                            delete documentObj[item._id].video_id
                        })
                        res.send(Object.values(documentObj))
                    })
                    .catch(result => res.status(result.status).send(result.err))
            }
        })
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const addVideoDocument = (req, res) =>
{
    if (req.headers.authorization && req.headers.authorization.role === "admin")
    {
        const {video_id, type, description} = req.body
        const file = req.files ? req.files.file : null
        if (video_id && file && type)
        {
            videoController.getVideosFunc({condition: {is_deleted: false, _id: video_id}, fields: "title"})
                .then(result =>
                {
                    const {videos} = result
                    if (videos.length === 1)
                    {
                        const video = videos[0]
                        saveFile({file, folder: type === "image" ? "pictures" : "files"})
                            .then(file =>
                            {
                                const newVideoDocument = new videoDocument({video_id, type, description, file})
                                newVideoDocument.save((err, created) =>
                                {
                                    if (err) res.status(400).send(err)
                                    else res.send({...created.toJSON(), video})
                                })
                            })
                            .catch((err) => res.status(400).send(err))
                    }
                    else res.status(404).send({message: "video not found!"})
                })
                .catch(result => res.status(result.status).send(result.err))
        }
        else res.status(400).send({message: "send video_id && file && type!"})
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const deleteVideoDocument = (req, res) =>
{
    if (req.headers.authorization && req.headers.authorization.role === "admin")
    {
        const {video_id} = req.params
        videoDocument.deleteOne({_id: video_id}, err =>
        {
            if (err) res.status(400).send(err)
            else res.send({message: "ok"})
        })
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const videoDocumentController = {
    getVideoDocumentsByVideoId,
    addVideoDocument,
    getVideoDocuments,
    deleteVideoDocument,
}

export default videoDocumentController