import mongoose from "mongoose"
import viewModel from "../models/viewModel"
import userController from "./userController"
import numberCorrection from "../functions/numberCorrection"
import JDate from "jalali-date"

const view = mongoose.model("view", viewModel)

const addView = (req, res) =>
{
    delete req.body.created_date
    const newView = new view({...req.body, user_agent: req.headers["user-agent"], user_id: req.headers.authorization ? req.headers.authorization._id : undefined})
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
                    user_agent: {$not: new RegExp("bot")},
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
    else res.status(403).send({message: "you don't have permission babe!"})
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
                    user_agent: {$not: new RegExp("bot")},
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
    else res.status(403).send({message: "you don't have permission babe!"})
}

const getAllPageViews = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        view.aggregate([
            {
                $match: {
                    type: "page",
                    user_agent: {$not: new RegExp("bot")},
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
    else res.status(403).send({message: "you don't have permission babe!"})
}

const getAllVideoViews = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        view.aggregate([
            {
                $match: {
                    type: "video",
                    user_agent: {$not: new RegExp("bot")},
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
    else res.status(403).send({message: "you don't have permission babe!"})
}

const getTodaySignUps = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        userController.getUsers({condition: {created_date: {$gte: new Date().setDate(new Date().getDate() - 1)}}})
            .then(result => res.send({todaySignUp: result.users, todaySignUpCount: result.users.length}))
            .catch(result => res.status(result.status).send(result.err))
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const getAllSignUps = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const source = req.query.source
        const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 9
        const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
        let options = {sort: "-created_date", skip, limit}

        let condition = null
        if (source === "email") condition = {email: {$exists: true}}
        else if (source === "completed")
        {
            condition = {
                email: {$exists: true},
                name: {$exists: true},
                major: {$exists: true},
                grade: {$exists: true},
                entrance: {$exists: true},
                birth_date: {$exists: true},
                university: {$exists: true},
            }
        }
        else if (source === "view") options = null

        userController.getUsers({condition, options})
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
                            userController.getUsersCount({condition})
                                .then((resultCount) => res.send({users: result.users, count: resultCount.users, stats: takenStats}))
                                .catch(result => res.status(result.status).send(result.err))
                        }
                        else res.send({users: result.users, stats: takenStats})
                    }
                })
            })
            .catch(result => res.status(result.status).send(result.err))
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const getTodayUserViews = (req, res) => // Didn't use in front
{
    if (req.headers.authorization.role === "admin")
    {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        view.aggregate([
            {$match: {created_date: {$gte: yesterday}}},
            {$group: {_id: "$user_id", count: {$sum: 1}}},
            {$sort: {count: -1}},
        ], (err, takenStats) =>
        {
            if (err) res.status(500).send(err)
            else res.send(takenStats)
        })
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const usersDiagram = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const {step} = req.params
        let stat = []
        const date = {date: new Date("2019-10-11 18:38:22.743Z")}
        getUserStat(stat, date, step, res)
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const getUserStat = (stat, date, step, res) =>
{
    if (date.date < new Date())
    {
        userController.getUsersCount({condition: {created_date: {$lte: date.date}}})
            .then(result =>
            {
                stat.push({name: numberCorrection(date.date.toLocaleDateString("fa-ir")), "ثبت نام": result.users})
                date.date.setDate(date.date.getDate() + parseInt(step))
                getUserStat(stat, date, step, res)
            })
    }
    else
    {
        userController.getUsersCount({condition: {created_date: {$lte: date.date}}})
            .then(result =>
            {
                stat.push({name: numberCorrection(date.date.toLocaleDateString("fa-ir")), "ثبت نام": result.users})
                res.send(stat)
            })
    }
}

const viewDailyDiagram = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const today = new Date()
        today.setDate(today.getDate() - 30)
        const geoDate = numberCorrection(today.toLocaleDateString("fa-ir")).split("/")
        const year = parseInt(geoDate[0])
        const month = parseInt(geoDate[1])
        const day = parseInt(geoDate[2])
        const date = {date: JDate.toGregorian(year, month, day)}
        let stat = []
        getViewDailyStat(stat, date, res)
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const getViewDailyStat = (stat, date, res) =>
{
    if (date.date < new Date())
    {
        let tomorrow = new Date(date.date)
        tomorrow.setDate(tomorrow.getDate() + 1)
        view.countDocuments({
            user_agent: {$not: new RegExp("bot")},
            created_date: {$gte: date.date, $lt: tomorrow},
            user_id: {
                $nin: [
                    mongoose.Types.ObjectId("5da0cc1e8088bb5a41e40eff"), mongoose.Types.ObjectId("5da0e75a7d95bc0b30c492ca"),
                    mongoose.Types.ObjectId("5da0e8d67d95bc0b30c492cb"), mongoose.Types.ObjectId("5e430d93dec1c036332cf926"),
                    mongoose.Types.ObjectId("5da2eec47d95bc0b30c492cf"), mongoose.Types.ObjectId("5dc2ac8955a4e622fe895a92"),
                ],
            },
        }, (err, takenStats) =>
        {
            if (err) res.status(500).send(err)
            else
            {
                stat.push({name: date.date.toLocaleDateString("fa-ir"), "بازدید": takenStats})
                date.date.setDate(date.date.getDate() + 1)
                getViewDailyStat(stat, date, res)
            }
        })
    }
    else res.send(stat)
}

const viewController = {
    addView,
    getTodayPageViews,
    getTodayVideoViews,
    getTodaySignUps,
    getAllPageViews,
    getAllVideoViews,
    getAllSignUps,
    getTodayUserViews,
    usersDiagram,
    viewDailyDiagram,
}

export default viewController