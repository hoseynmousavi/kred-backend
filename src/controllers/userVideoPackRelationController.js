import mongoose from "mongoose"
import userVideoPackRelationModel from "../models/userVideoPackRelationModel"
import userController from "./userController"
import buyVideoPackController from "./buyVideoPackController"
import videoPackController from "./videoPackController"

const userVideoPackRelation = mongoose.model("userVideoPack", userVideoPackRelationModel)

const getPermissionsFunc = ({condition}) =>
{
    return new Promise((resolve, reject) =>
    {
        userVideoPackRelation.find({...condition}, (err, relations) =>
        {
            if (err) reject({status: 500, err})
            else resolve({status: 200, relations})
        })
    })
}

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

const getAllUserVideoPack = (req, res) =>
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
                        userController.getUsers({condition: {_id: {$in: [...new Set(userPacks.reduce((sum, pack) => [...sum, pack.user_id], []))]}}})
                            .then(result =>
                            {
                                let usersObj = result.users.reduce((sum, user) => ({...sum, [user._id]: {...user.toJSON()}}), {})
                                Object.values(userPacksObj).forEach(item =>
                                {
                                    userPacksObj[item._id].user = {...usersObj[item.user_id]}
                                    delete userPacksObj[item._id].user_id
                                })
                                videoPackController.getVideoPacksFunc({condition: {_id: {$in: [...new Set(userPacks.reduce((sum, pack) => [...sum, pack.video_pack_id], []))]}}})
                                    .then(resultPacks =>
                                    {
                                        let packObj = resultPacks.takenVideoPacks.reduce((sum, pack) => ({...sum, [pack._id]: {...pack.toJSON()}}), {})
                                        Object.values(userPacksObj).forEach(item =>
                                        {
                                            userPacksObj[item._id].video_pack = {...packObj[item.video_pack_id]}
                                            delete userPacksObj[item._id].video_pack_id
                                        })
                                        res.send(Object.values(userPacksObj))
                                    })
                                    .catch(result =>
                                    {
                                        console.log(result.message)
                                        res.status(result.status || 500).send(result.err)
                                    })
                            })
                            .catch(result =>
                            {
                                console.log(result.message)
                                res.status(result.status || 500).send(result.err)
                            })
                    })
                    .catch(result =>
                    {
                        console.log(result.message)
                        res.status(result.status || 500).send(result.err)
                    })
            }
        })
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const getTodayUserVideoPack = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        userVideoPackRelation.find({created_date: {$gte: new Date().setDate(new Date().getDate() - 1)}}, (err, userPacks) =>
        {
            if (err) res.status(500).send(err)
            else
            {
                let userPacksObj = userPacks.reduce((sum, pack) => ({...sum, [pack._id]: {...pack.toJSON()}}), {})

                buyVideoPackController.getBuyVideoPacks({condition: {is_done_successful: true, created_date: {$gte: new Date().setDate(new Date().getDate() - 1)}}})
                    .then(result =>
                    {
                        const buyVideoPacksObj = result.buyVideoPacks.reduce((sum, buy) => ({...sum, [buy._id]: {...buy.toJSON()}}), {})
                        Object.values(userPacksObj).forEach(item =>
                        {
                            if (item.buy_video_pack_id) userPacksObj[item._id].price = buyVideoPacksObj[item.buy_video_pack_id].price
                        })
                        userController.getUsers({condition: {_id: {$in: [...new Set(userPacks.reduce((sum, pack) => [...sum, pack.user_id], []))]}}})
                            .then(result =>
                            {
                                let usersObj = result.users.reduce((sum, user) => ({...sum, [user._id]: {...user.toJSON()}}), {})
                                Object.values(userPacksObj).forEach(item =>
                                {
                                    userPacksObj[item._id].user = {...usersObj[item.user_id]}
                                    delete userPacksObj[item._id].user_id
                                })
                                videoPackController.getVideoPacksFunc({condition: {_id: {$in: [...new Set(userPacks.reduce((sum, pack) => [...sum, pack.video_pack_id], []))]}}})
                                    .then(resultPacks =>
                                    {
                                        let packObj = resultPacks.takenVideoPacks.reduce((sum, pack) => ({...sum, [pack._id]: {...pack.toJSON()}}), {})
                                        Object.values(userPacksObj).forEach(item =>
                                        {
                                            userPacksObj[item._id].video_pack = {...packObj[item.video_pack_id]}
                                            delete userPacksObj[item._id].video_pack_id
                                        })
                                        res.send(Object.values(userPacksObj))
                                    })
                                    .catch(result =>
                                    {
                                        console.log(result.message)
                                        res.status(result.status || 500).send(result.err)
                                    })
                            })
                            .catch(result =>
                            {
                                console.log(result.message)
                                res.status(result.status || 500).send(result.err)
                            })
                    })
                    .catch(result =>
                    {
                        console.log(result.message)
                        res.status(result.status || 500).send(result.err)
                    })
            }
        })
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const userVideoPackRelationController = {
    addUserVideoPackPermission,
    getTodayUserVideoPack,
    getAllUserVideoPack,
    getPermissionsFunc,
}

export default userVideoPackRelationController