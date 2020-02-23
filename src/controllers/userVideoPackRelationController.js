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

const userVideoPackRelationController = {
    addUserVideoPackPermission,
}

export default userVideoPackRelationController