import mongoose from "mongoose"
import userVideoPackRelationModel from "../models/userVideoPackRelationModel"

const userVideoPackRelation = mongoose.model("userVideoPack", userVideoPackRelationModel)

const addUserVideoPackPermission = ({user_id, video_pack_id}) =>
{
    return new Promise((resolve, reject) =>
    {
        const newUserVideoPackRelation = new userVideoPackRelation({user_id, video_pack_id})
        newUserVideoPackRelation.save((err, _) =>
        {
            if (err) reject({status: 500, err})
            else resolve({status: 200})
        })
    })
}

const addUserVideoPackPermissionRoute = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const {user_id, video_pack_id} = req.body
        if (user_id && video_pack_id)
        {
            userVideoPackRelationController.addUserVideoPackPermission({video_pack_id, user_id})
                .then(() => res.send({message: "done admin!"}))
                .catch((result) => res.status(result.status || 500).send({message: result.err}))
        }
        else res.status(400).send("send ok data")
    }
    else res.status(403).send("don't have permission babe")
}

const userVideoPackRelationController = {
    addUserVideoPackPermission,
    addUserVideoPackPermissionRoute,
}

export default userVideoPackRelationController