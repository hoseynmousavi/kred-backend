import mongoose from "mongoose"
import userVideoPackRelationModel from "../models/userVideoPackRelationModel"
import userController from "./userController"
import buyVideoPackController from "./buyVideoPackController"

const userVideoPackRelation = mongoose.model("userVideoPack", userVideoPackRelationModel)

const addUserVideoPackPermission = ({user_id, video_pack_id, buy_video_pack_id}) =>
{
    return new Promise((resolve, reject) =>
    {
        const newUserVideoPackRelation = new userVideoPackRelation({user_id, video_pack_id, buy_video_pack_id})
        newUserVideoPackRelation.save((err, _) =>
        {
            if (err) reject({status: 500, err})
            else resolve({status: 200})
        })
    })
}

const getUserVideoPack = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        userVideoPackRelation.find(null, (err, userPacks) =>
        {
            if (err) res.status(500).send(err)
            else
            {
                let userPacksObj = userPacks.reduce((sum, pack) => ({...sum, [pack._id]: {...pack.toJSON()}}), {})

                buyVideoPackController.getBuyVideoPacks({condition: {is_done_successful: true}})
                    .then(result =>
                    {
                        const buyVideoPacksObj = result.buyVideoPacks.reduce((sum, buy) => ({...sum, [buy._id]: {...buy.toJSON()}}), {})
                        Object.values(userPacksObj).forEach(item =>
                        {
                            if (item.buy_video_pack_id) userPacksObj[item._id].price = buyVideoPacksObj[item.buy_video_pack_id].price
                        })
                        userController.getUsers({condition: {_id: {$in: userPacks.reduce((sum, pack) => [...sum, pack.user_id], [])}}})
                            .then(result =>
                            {
                                let usersObj = result.users.reduce((sum, user) => ({...sum, [user._id]: {...user.toJSON()}}), {})
                                Object.values(userPacksObj).forEach(item =>
                                {
                                    userPacksObj[item._id].user = {...usersObj[item.user_id]}
                                    delete userPacksObj[item._id].user_id
                                })
                                res.send(Object.values(userPacksObj))
                            })
                            .catch(result => res.status(result.status).send(result.err))
                    })
                    .catch(result => res.status(result.status).send(result.err))
            }
        })
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const userVideoPackRelationController = {
    addUserVideoPackPermission,
    getUserVideoPack,
}

export default userVideoPackRelationController