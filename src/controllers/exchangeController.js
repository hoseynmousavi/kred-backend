import mongoose from "mongoose"
import exchangeModel from "../models/exchangeModel"

const exchange = mongoose.model("exchange", exchangeModel)

const getExchanges = (req, res) =>
{
    const limit = parseInt(req.query.limit, 10) || 9
    const skip = (parseInt(req.query.page, 10) || 0) * limit
    exchange.find({is_deleted: false, is_verified: true}, {title: 1, price: 1, telegram: 1, whatsapp: 1, phone: 1, city_id: 1, description: 1, created_date: 1, user_id: 1}, {skip, limit}, (err, users) =>
    {
        if (err) res.status(400).send(err)
        else res.send(users)
    })
}

const getExchangeById = (req, res) =>
{
    exchange.findById(req.params.exchangeId, (err, takenExchange) =>
    {
        if (err) res.status(500).send(err)
        else if (!takenExchange) res.status(404).send({message: "not found!"})
        else res.send(takenExchange)
    })
}

const addNewExchange = (req, res) =>
{
    if (!req.body.phone && !req.body.telegram && !req.body.whatsapp) res.status(400).send({message: "please send one of [phone, telegram, whatsapp]"})
    else
    {
        delete req.body.created_date
        delete req.body.is_verified
        delete req.body.is_deleted
        delete req.body.user_id
        const newExchange = new exchange({...req.body, user_id: req.headers.authorization._id})
        newExchange.save((err, createdExchange) =>
        {
            if (err) res.status(400).send(err)
            else res.send(createdExchange)
        })
    }
}

const updateExchangeById = (req, res) =>
{
    // TODO Hoseyn check token role then let them update even these things
    delete req.body.created_date
    delete req.body.is_verified
    delete req.body.is_deleted
    delete req.body.user_id
    exchange.findOneAndUpdate({user_id: req.headers.authorization._id, _id: req.body._id}, req.body, {new: true, useFindAndModify: false, runValidators: true}, (err, updatedExchange) =>
    {
        if (err) res.status(400).send(err)
        else if (!updatedExchange) res.status(404).send({message: "not found!"})
        else res.send(updatedExchange)
    })
}

const deleteExchangeById = (req, res) =>
{
    exchange.deleteOne({user_id: req.headers.authorization._id, _id: req.body._id}, (err) =>
    {
        if (err) res.status(400).send(err)
        else res.send({message: "user deleted successfully"})
    })
}

const userController = {
    getExchanges,
    updateExchangeById,
    addNewExchange,
    deleteExchangeById,
    getExchangeById,
}

export default userController