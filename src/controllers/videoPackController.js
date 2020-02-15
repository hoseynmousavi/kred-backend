import mongoose from "mongoose"
import videoPackModel from "../models/videoPackModel"

const videoPack = mongoose.model("videoPack", videoPackModel)

const getVideoPacks = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 9
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    const options = {sort: "-created_date", skip, limit}

    videoPack.find(
        {is_deleted: false},
        options,
        (err, exchanges) => err ? res.status(400).send(err) : res.send(exchanges),
    )
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
}

export default videoPackController