import mongoose from "mongoose"
import videoPackModel from "../models/videoPackModel"
import videoPackCategoryController from "./videoPackCategoryController"
import videoController from "./videoController"
import userVideoPackRelationController from "./userVideoPackRelationController"

const videoPack = mongoose.model("videoPack", videoPackModel)

const getVideoPacks = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 9
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    const options = {sort: "-created_date", skip, limit}

    videoPack.find(
        {is_deleted: false},
        null,
        options,
        (err, videoPacks) =>
        {
            if (err) res.status(400).send(err)
            else
            {
                if (req.headers.authorization && req.headers.authorization._id)
                {
                    if (req.headers.authorization.role === "admin")
                    {
                        let videoPacksArr = [...videoPacks]
                        videoPacksArr.forEach((item, index) =>
                            videoPacksArr[index] = {...videoPacksArr[index].toJSON(), have_permission: true},
                        )
                        res.send(videoPacksArr)
                    }
                    else
                    {
                        userVideoPackRelationController.getPermissionsFunc({condition: {user_id: req.headers.authorization._id}})
                            .then((result) =>
                            {
                                const videoPacksObj = videoPacks.reduce((sum, pack) => ({...sum, [pack._id]: {...pack.toJSON()}}), {})
                                result.relations.forEach(item =>
                                    videoPacksObj[item.video_pack_id] = {...videoPacksObj[item.video_pack_id], have_permission: true},
                                )
                                res.send(Object.values(videoPacksObj))
                            })
                            .catch(() => res.send(videoPacks))
                    }
                }
                else res.send(videoPacks)
            }
        },
    )
}

const getVideoPackById = (req, res) =>
{
    videoPack.findById(req.params.videoPackId, (err, takenVideoPack) =>
    {
        if (err) res.status(500).send(err)
        else if (!takenVideoPack || takenVideoPack.is_deleted) res.status(404).send({message: "not found!"})
        else
        {
            let videoPackJson = takenVideoPack.toJSON()
            delete videoPackJson.is_deleted
            videoPackCategoryController.getVideoPackCategories({videoPackId: videoPackJson._id})
                .then((result) =>
                {
                    videoController.getVideos({videoPackCategoryId: {$in: result.videoPackCategories.reduce((sum, category) => [...sum, category._id], [])}})
                        .then((results) =>
                        {
                            let videoPackCategories = result.videoPackCategories.reduce((sum, category) => ({...sum, [category._id]: {...category.toJSON()}}), {})
                            results.videoPackVideos.forEach(video =>
                            {
                                const previousVideos = videoPackCategories[video.video_pack_category_id].videos || []
                                videoPackCategories[video.video_pack_category_id].videos = [
                                    ...previousVideos,
                                    video,
                                ]
                            })
                            if (req.headers.authorization && req.headers.authorization._id)
                            {
                                if (req.headers.authorization.role === "admin")
                                {
                                    res.send({...videoPackJson, have_permission: true, categories: Object.values(videoPackCategories)})
                                }
                                else
                                {
                                    userVideoPackRelationController.getPermissionsFunc({condition: {user_id: req.headers.authorization._id, video_pack_id: videoPackJson._id}})
                                        .then((result) =>
                                            res.send({...videoPackJson, have_permission: result.relations && result.relations.length > 0, categories: Object.values(videoPackCategories)}),
                                        )
                                        .catch(() => res.send({...videoPackJson, categories: Object.values(videoPackCategories)}))
                                }
                            }
                            else res.send({...videoPackJson, categories: Object.values(videoPackCategories)})
                        })
                        .catch((err) => res.status(err.status || 500).send(err.message))
                })
                .catch((err) => res.status(err.status || 500).send(err))
        }
    })
}

const getPureVideoPackById = ({videoPackId}) =>
{
    return new Promise((resolve, reject) =>
    {
        videoPack.findById(videoPackId, (err, takenVideoPack) =>
        {
            if (err) reject({status: 500, err})
            else if (!takenVideoPack || takenVideoPack.is_deleted) reject({status: 404, err: {message: "not found!"}})
            else resolve({status: 200, videoPack: takenVideoPack.toJSON()})
        })
    })
}

const addNewVideoPack = (req, res) =>
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
                delete req.body.created_date
                delete req.body.is_deleted
                delete req.body.user_id
                const newVideoPack = new videoPack({...req.body, picture: `media/pictures/${picName}`, user_id: req.headers.authorization._id})
                newVideoPack.save((err, createdPack) =>
                {
                    if (err)
                    {
                        console.log(err)
                        res.status(400).send(err)
                    }
                    else res.send(createdPack)
                })
            })
        }
        else res.status(400).send({message: "send picture!"})
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const videoPackController = {
    getVideoPacks,
    addNewVideoPack,
    getVideoPackById,
    getPureVideoPackById,
}

export default videoPackController