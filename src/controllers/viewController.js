import mongoose from "mongoose"
import viewModel from "../models/viewModel"
import userModel from "../models/userModel"

const view = mongoose.model("view", viewModel)
const user = mongoose.model("user", userModel)

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

const getViews = (req, res) =>
{
    if (req.headers.authorization && req.headers.authorization.role === "admin")
        view.find(
            {user_id: {$nin: ["5da0cc1e8088bb5a41e40eff", "5da0e75a7d95bc0b30c492ca", "5da0e8d67d95bc0b30c492cb", "5da2eec47d95bc0b30c492cf", "5dc2ac8955a4e622fe895a92", "5e430d93dec1c036332cf926"]}},
            null,
            null,
            (err, views) =>
            {
                if (err) res.status(500).send(err)
                else
                {
                    let allPagesCount = 0
                    let allPages = {}
                    let allVideosCount = 0
                    let allVideos = {}
                    let allSignUpCount = 0

                    let todayPagesCount = 0
                    let todayPages = {}
                    let todayVideosCount = 0
                    let todayVideos = {}
                    let todaySignUpCount = 0
                    views.forEach(item =>
                    {
                        if (item.type === "page")
                        {
                            allPagesCount++
                            allPages[item.content] ? allPages[item.content].count++ : allPages[item.content] = {title: item.content, count: 1}
                            if (item.created_date.toISOString().split("T")[0] === new Date().toISOString().split("T")[0])
                            {
                                todayPagesCount++
                                todayPages[item.content] ? todayPages[item.content].count++ : todayPages[item.content] = {title: item.content, count: 1}
                            }
                        }
                        else if (item.type === "video")
                        {
                            allVideosCount++
                            allVideos[item.content] ? allVideos[item.content].count++ : allVideos[item.content] = {title: item.content, count: 1}
                            if (item.created_date.toISOString().split("T")[0] === new Date().toISOString().split("T")[0])
                            {
                                todayVideosCount++
                                todayVideos[item.content] ? todayVideos[item.content].count++ : todayVideos[item.content] = {title: item.content, count: 1}
                            }
                        }
                    })
                    user.find(
                        {created_date: {$lt: new Date(), $gte: new Date(new Date().setDate(new Date().getDate() - 1))}},
                        (err, todaySignUp) =>
                        {
                            if (err) res.status(500).send(err)
                            else
                            {
                                todaySignUpCount = todaySignUp.length
                                user.countDocuments(
                                    null,
                                    (err, allSignUp) =>
                                    {
                                        if (err) res.status(500).send(err)
                                        else
                                        {
                                            allSignUpCount = allSignUp
                                            res.send({allSignUpCount, allPagesCount, allPages, allVideosCount, allVideos, todaySignUpCount, todaySignUp, todayPagesCount, todayPages, todayVideosCount, todayVideos})
                                        }
                                    })

                            }
                        })
                }
            },
        )
    else res.status(403).send()
}

const viewController = {
    addView,
    getViews,
}

export default viewController