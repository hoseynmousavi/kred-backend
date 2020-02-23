import mongoose from "mongoose"
import videoPackCategoryModel from "../models/videoPackCategoryModel"

const videoPackCategory = mongoose.model("videoPackCategory", videoPackCategoryModel)

const getVideoPackCategories = ({videoPackId}) =>
{
    return new Promise((resolve, reject) =>
    {
        videoPackCategory.find(
            {video_pack_id: videoPackId},
            null,
            null,
            (err, videoPackCategories) =>
            {
                if (err) reject({status: 500, err})
                else resolve({status: 200, videoPackCategories})
            },
        )
    })
}

const getVideoPackCategoryByVideo = ({videoPackCategoryId}) =>
{
    return new Promise((resolve, reject) =>
    {
        videoPackCategory.findOne({_id: videoPackCategoryId}, (err, videoPackCategory) =>
        {
            if (err) reject({status: 500, err})
            else if (!videoPackCategory) reject({status: 404, err: {message: "not found!"}})
            else resolve({status: 200, videoPackCategory})
        })
    })
}

const addNewVideoPackCategory = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const picture = req.files ? req.files.picture : null
        if (picture)
        {
            const picName = new Date().toISOString() + picture.name
            picture.mv(`media/pictures/${picName}`, (err) =>
            {
                if (err) console.log(err)
                const newVideoPackCategory = new videoPackCategory({...req.body})
                newVideoPackCategory.save((err, createdVideoPackCategory) =>
                {
                    if (err)
                    {
                        console.log(err)
                        res.status(400).send(err)
                    }
                    else res.send(createdVideoPackCategory)
                })
            })
        }
        else
        {
            const newVideoPackCategory = new videoPackCategory({...req.body})
            newVideoPackCategory.save((err, createdPack) =>
            {
                if (err)
                {
                    console.log(err)
                    res.status(400).send(err)
                }
                else res.send(createdPack)
            })
        }
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const videoPackCategoryController = {
    getVideoPackCategories,
    addNewVideoPackCategory,
    getVideoPackCategoryByVideo,
}

export default videoPackCategoryController