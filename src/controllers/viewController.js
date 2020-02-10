import mongoose from "mongoose"
import viewModel from "../models/viewModel"

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

const getViews = (req, res) =>
{
    if (req.headers.authorization && req.headers.authorization.role === "admin")
        view.find(
            null,
            null,
            null,
            (err, views) => err ? res.status(500).send(err) : res.send(views),
        )
    else res.status(403).send()
}

const viewController = {
    addView,
    getViews,
}

export default viewController