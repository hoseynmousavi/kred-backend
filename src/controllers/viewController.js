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
        else res.status(200).send({message: "saved babe"})
    })
}

const getTodayPageViews = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        view.find(
            {
                user_id: {
                    $nin: [
                        "5da0cc1e8088bb5a41e40eff", "5da0e75a7d95bc0b30c492ca", "5da0e8d67d95bc0b30c492cb",
                        "5da2eec47d95bc0b30c492cf", "5dc2ac8955a4e622fe895a92", "5e430d93dec1c036332cf926",
                    ],
                },
                created_date: {$lt: new Date(), $gte: new Date().setDate(new Date().getDate() - 1)},
                type: "page",
            },
            (err, views) =>
            {
                if (err) res.status(500).send(err)
                else
                {
                    let todayPagesCount = 0
                    let todayPages = {}
                    views.forEach(item =>
                    {
                        todayPagesCount++
                        todayPages[item.content] ? todayPages[item.content].count++ : todayPages[item.content] = {title: item.content, count: 1}
                    })
                    res.send({todayPagesCount, todayPages})
                }
            })
    }
    else res.status(403).send()
}

const getTodayVideoViews = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        view.find(
            {
                user_id: {
                    $nin: [
                        "5da0cc1e8088bb5a41e40eff", "5da0e75a7d95bc0b30c492ca", "5da0e8d67d95bc0b30c492cb",
                        "5da2eec47d95bc0b30c492cf", "5dc2ac8955a4e622fe895a92", "5e430d93dec1c036332cf926",
                    ],
                },
                created_date: {$lt: new Date(), $gte: new Date().setDate(new Date().getDate() - 1)},
                type: "video",
            },
            (err, views) =>
            {
                if (err) res.status(500).send(err)
                else
                {
                    let todayVideosCount = 0
                    let todayVideos = {}
                    views.forEach(item =>
                    {
                        todayVideosCount++
                        todayVideos[item.content] ? todayVideos[item.content].count++ : todayVideos[item.content] = {title: item.content, count: 1}
                    })
                    res.send({todayVideosCount, todayVideos})
                }
            })
    }
    else res.status(403).send()
}

const getTodaySignUps = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        userController.getUsers({condition: {created_date: {$lt: new Date(), $gte: new Date().setDate(new Date().getDate() - 1)}}})
            .then(result => res.send({todaySignUp: result.users, todaySignUpCount: result.users.length}))
            .catch(result => res.status(result.status).send(result.err))
    }
    else res.status(403).send()
}

const viewController = {
    addView,
    getTodayPageViews,
    getTodayVideoViews,
    getTodaySignUps,
}

export default viewController