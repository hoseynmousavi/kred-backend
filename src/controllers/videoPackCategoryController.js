import mongoose from "mongoose"
import videoPackCategoryModel from "../models/videoPackCategoryModel"

const videoPackCategory = mongoose.model("videoPackCategory", videoPackCategoryModel)

const getVideoPackCategories = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 9
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    const options = {skip, limit}

    videoPackCategory.find(
        null,
        null,
        options,
        (err, videoPackCategories) => err ? res.status(400).send(err) : res.send(videoPackCategories),
    )
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
}

export default videoPackCategoryController