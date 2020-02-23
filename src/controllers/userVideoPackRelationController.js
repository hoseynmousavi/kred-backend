import mongoose from "mongoose"
import userVideoPackRelationModel from "../models/userVideoPackRelationModel"

const userVideoPackRelation = mongoose.model("userVideoPack", userVideoPackRelationModel)

const addUserVideoPackPermission = (req, res) =>
{
    const newUserVideoPackRelation = new userVideoPackRelation(req.body)
    newUserVideoPackRelation.save((err, createdRelation) =>
    {
        if (err) res.status(500).send(err)
        else res.send(createdRelation)
    })
}

const userVideoPackRelationController = {
    addUserVideoPackPermission,
}

// TODO Hoseyn add buy option

export default userVideoPackRelationController