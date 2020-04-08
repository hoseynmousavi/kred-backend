import mongoose from "mongoose"
import viewModel from "../models/viewModel"
import userController from "./userController"

const view = mongoose.model("view", viewModel)

const addView = (req, res) =>
{
    delete req.body.created_date
    const newView = new view({...req.body, user_id: req.headers.authorization ? req.headers.authorization._id : undefined})
    newView.save((err) =>
    {
        if (err) res.status(400).send(err)
        else res.status(200).send({message: "ok"})
    })
}

const getTodayPageViews = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        view.aggregate([
            {
                $match: {
                    type: "page",
                    created_date: {$gte: yesterday},
                    user_id: {
                        $nin: [
                            mongoose.Types.ObjectId("5da0cc1e8088bb5a41e40eff"), mongoose.Types.ObjectId("5da0e75a7d95bc0b30c492ca"),
                            mongoose.Types.ObjectId("5da0e8d67d95bc0b30c492cb"), mongoose.Types.ObjectId("5e430d93dec1c036332cf926"),
                            mongoose.Types.ObjectId("5da2eec47d95bc0b30c492cf"), mongoose.Types.ObjectId("5dc2ac8955a4e622fe895a92"),
                        ],
                    },
                },
            },
            {$group: {_id: "$content", count: {$sum: 1}}},
            {$sort: {count: -1}},
        ], (err, todayPagesCount) =>
        {
            if (err) res.status(500).send(err)
            else res.send({todayPagesCount})
        })
    }
    else res.status(403).send()
}

const getTodayVideoViews = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        view.aggregate([
            {
                $match: {
                    type: "video",
                    created_date: {$gte: yesterday},
                    user_id: {
                        $nin: [
                            mongoose.Types.ObjectId("5da0cc1e8088bb5a41e40eff"), mongoose.Types.ObjectId("5da0e75a7d95bc0b30c492ca"),
                            mongoose.Types.ObjectId("5da0e8d67d95bc0b30c492cb"), mongoose.Types.ObjectId("5e430d93dec1c036332cf926"),
                            mongoose.Types.ObjectId("5da2eec47d95bc0b30c492cf"), mongoose.Types.ObjectId("5dc2ac8955a4e622fe895a92"),
                        ],
                    },
                },
            },
            {$group: {_id: "$content", count: {$sum: 1}}},
            {$sort: {count: -1}},
        ], (err, todayVideosCount) =>
        {
            if (err) res.status(500).send(err)
            else res.send({todayVideosCount})
        })
    }
    else res.status(403).send()
}

const getAllPageViews = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        view.aggregate([
            {
                $match: {
                    type: "page",
                    user_id: {
                        $nin: [
                            mongoose.Types.ObjectId("5da0cc1e8088bb5a41e40eff"), mongoose.Types.ObjectId("5da0e75a7d95bc0b30c492ca"),
                            mongoose.Types.ObjectId("5da0e8d67d95bc0b30c492cb"), mongoose.Types.ObjectId("5e430d93dec1c036332cf926"),
                            mongoose.Types.ObjectId("5da2eec47d95bc0b30c492cf"), mongoose.Types.ObjectId("5dc2ac8955a4e622fe895a92"),
                        ],
                    },
                },
            },
            {$group: {_id: "$content", count: {$sum: 1}}},
            {$sort: {count: -1}},
        ], (err, takenStats) =>
        {
            if (err) res.status(500).send(err)
            else res.send(takenStats)
        })
    }
    else res.status(403).send()
}

const getAllVideoViews = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        view.aggregate([
            {
                $match: {
                    type: "video",
                    user_id: {
                        $nin: [
                            mongoose.Types.ObjectId("5da0cc1e8088bb5a41e40eff"), mongoose.Types.ObjectId("5da0e75a7d95bc0b30c492ca"),
                            mongoose.Types.ObjectId("5da0e8d67d95bc0b30c492cb"), mongoose.Types.ObjectId("5e430d93dec1c036332cf926"),
                            mongoose.Types.ObjectId("5da2eec47d95bc0b30c492cf"), mongoose.Types.ObjectId("5dc2ac8955a4e622fe895a92"),
                        ],
                    },
                },
            },
            {$group: {_id: "$content", count: {$sum: 1}}},
            {$sort: {count: -1}},
        ], (err, takenStats) =>
        {
            if (err) res.status(500).send(err)
            else res.send(takenStats)
        })
    }
    else res.status(403).send()
}

const getTodaySignUps = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        userController.getUsers({condition: {created_date: {$gte: new Date().setDate(new Date().getDate() - 1)}}})
            .then(result => res.send({todaySignUp: result.users, todaySignUpCount: result.users.length}))
            .catch(result => res.status(result.status).send(result.err))
    }
    else res.status(403).send()
}

const getAllSignUps = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 9
        const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
        const options = {sort: "-created_date", skip, limit}
        userController.getUsers({condition: null, options})
            .then(result =>
            {
                view.aggregate([
                    {$match: {user_id: {$in: result.users.reduce((sum, user) => [...sum, user.toJSON()._id], [])}}},
                    {$group: {_id: "$user_id", count: {$sum: 1}}},
                    {$sort: {count: -1}},
                ], (err, takenStats) =>
                {
                    if (err) res.status(500).send(err)
                    else
                    {
                        if (skip === 0)
                        {
                            userController.getUsersCount({condition: null})
                                .then((resultCount) => res.send({users: result.users, count: resultCount.users, stats: takenStats}))
                                .catch(result => res.status(result.status).send(result.err))
                        }
                        else res.send({users: result.users, stats: takenStats})
                    }
                })
            })
            .catch(result => res.status(result.status).send(result.err))
    }
    else res.status(403).send()
}

const viewController = {
    addView,
    getTodayPageViews,
    getTodayVideoViews,
    getTodaySignUps,
    getAllPageViews,
    getAllVideoViews,
    getAllSignUps,
}

export default viewController