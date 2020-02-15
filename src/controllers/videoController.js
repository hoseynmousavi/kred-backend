import mongoose from "mongoose"
import videoModel from "../models/videoModel"

const video = mongoose.model("video", videoModel)

const getVideos = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 9
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    const options = {sort: "-created_date", skip, limit}

    video.find(
        {is_deleted: false},
        null,
        options,
        (err, exchanges) => err ? res.status(400).send(err) : res.send(exchanges),
    )
}

const addNewVideo = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        delete req.body.created_date
        delete req.body.is_deleted
        delete req.body.user_id
        delete req.body.is_free
        const newVideo = new video({...req.body, user_id: req.headers.authorization._id})
        newVideo.save((err, createdVideo) =>
        {
            if (err)
            {
                console.log(err)
                res.status(400).send(err)
            }
            else res.send(createdVideo)
        })
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const videoController = {
    getVideos,
    addNewVideo,
}

export default videoController