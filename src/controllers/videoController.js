import mongoose from "mongoose"
import videoModel from "../models/videoModel"

const video = mongoose.model("video", videoModel)

const getFreeVideos = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 5
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    let query = {is_deleted: false, is_free: true, poster: {$exists: true}}
    const options = {sort: "-created_date", skip, limit}
    video.find(
        query,
        "title video_url subtitle_url poster",
        options,
        (err, freeVideos) =>
        {
            if (err) res.status(500).send(err)
            else
            {
                res.setHeader("Cache-Control", "max-age=604800")
                res.send(freeVideos)
            }
        },
    )
}

const getVideos = ({videoPackCategoryId}) =>
{
    return new Promise((resolve, reject) =>
    {
        video.find(
            {is_deleted: false, video_pack_category_id: videoPackCategoryId},
            null,
            null,
            (err, videoPackVideos) =>
            {
                if (err) reject({status: 500, err})
                else resolve({status: 200, videoPackVideos})
            },
        )
    })
}

const getVideosFunc = ({condition, fields, options}) =>
{
    return new Promise((resolve, reject) =>
    {
        video.find(
            condition,
            fields,
            options,
            (err, videos) =>
            {
                if (err) reject({status: 500, err})
                else resolve({status: 200, videos})
            },
        )
    })
}

const getVideoBySubtitleUrl = ({subtitleUrl}) =>
{
    return new Promise((resolve, reject) =>
    {
        video.findOne({subtitle_url: subtitleUrl}, (err, video) =>
        {
            if (err) reject({status: 500, err})
            else if (!video) reject({status: 404, err: {message: "not found!"}})
            else resolve({status: 200, video})
        })
    })
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

const getAllVideos = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 9
        const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
        let query = {is_deleted: false}
        if (req.query.searchTitle) query.title = new RegExp(req.query.searchTitle)
        const fields = "title"
        const options = {sort: "-created_date", skip, limit}
        video.find(query, fields, options, (err, videos) =>
        {
            if (err) res.status(400).send(err)
            else res.send(videos)
        })
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const videoController = {
    getVideos,
    addNewVideo,
    getVideoBySubtitleUrl,
    getFreeVideos,
    getVideosFunc,
    getAllVideos,
}

export default videoController