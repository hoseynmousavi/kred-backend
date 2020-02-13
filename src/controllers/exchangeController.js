import mongoose from "mongoose"
import exchangeModel from "../models/exchangeModel"
import exchangeCategoryModel from "../models/exchangeCategoryRelation"
import mailHelper from "../functions/mailHelper"

const exchange = mongoose.model("exchange", exchangeModel)
const exchangeCategory = mongoose.model("exchangeCategory", exchangeCategoryModel)

const getExchanges = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 9
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    let query = {is_deleted: false, is_verified: true}
    if (req.query.searchTitle) query.title = new RegExp(req.query.searchTitle)

    if (req.query.searchCategories)
    {
        const searchCategoriesArr = req.query.searchCategories.split(",")
        exchangeCategory.find(
            {category_id: {$in: searchCategoriesArr.reduce((sum, item) => [...sum, item], [])}},
            (err, shits) =>
            {
                query._id = {$in: shits.reduce((sum, item) => [...sum, item.exchange_id], [])}
                exchange.find(
                    query,
                    {title: 1, price: 1, telegram: 1, whatsapp: 1, phone: 1, city_id: 1, categories: 1, description: 1, created_date: 1, user_id: 1, picture: 1},
                    {sort: "-created_date", skip, limit},
                    (err, exchanges) => err ? res.status(400).send(err) : res.send(exchanges),
                )
            },
        )
    }
    else exchange.find(
        query,
        {title: 1, price: 1, telegram: 1, whatsapp: 1, phone: 1, city_id: 1, categories: 1, description: 1, created_date: 1, user_id: 1, picture: 1},
        {sort: "-created_date", skip, limit},
        (err, exchanges) => err ? res.status(400).send(err) : res.send(exchanges),
    )
}

const getExchangeById = (req, res) =>
{
    exchange.findById(req.params.exchangeId, (err, takenExchange) =>
    {
        if (err) res.status(500).send(err)
        else if (!takenExchange || takenExchange.is_deleted || !takenExchange.is_verified) res.status(404).send({message: "not found!"})
        else res.send(takenExchange)
    })
}

const addNewExchange = (req, res) =>
{
    if (!req.body.phone && !req.body.telegram && !req.body.whatsapp) res.status(400).send({message: "please send one of [phone, telegram, whatsapp]"})
    else
    {
        const picture = req.files ? req.files.picture : null
        if (picture)
        {
            const categories = JSON.parse(req.body.categories)
            const picName = new Date().toISOString() + picture.name
            picture.mv(`media/pictures/${picName}`, (err) =>
            {
                if (err) console.log(err)
                delete req.body.created_date
                delete req.body.is_deleted
                delete req.body.user_id
                req.headers.authorization.role === "admin" ? req.body.is_verified = true : delete req.body.is_verified
                const newExchange = new exchange({...req.body, picture: `media/pictures/${picName}`, user_id: req.headers.authorization._id})
                newExchange.save((err, createdExchange) =>
                {
                    if (err)
                    {
                        console.log(err)
                        res.status(400).send(err)
                    }
                    else
                    {
                        res.send(createdExchange)
                        categories.forEach(item => new exchangeCategory({category_id: item, exchange_id: createdExchange._id}).save())
                        if (req.headers.authorization.role !== "admin")
                        {
                            mailHelper.sendMail({
                                subject: "آگهی جدید داریم!",
                                text: `آگهی جدید : ${createdExchange.title}`,
                                receivers: "aidin.sh1377@gmail.com, miri1888@gmail.com, erfanv1@gmail.com, eziaie1998@gmail.com, zmahramian@gmail.com, hoseyn.mousavi78@gmail.com",
                            })
                        }
                    }
                })
            })
        }
        else res.status(400).send({message: "send picture!"})
    }
}

const updateExchangeById = (req, res) =>
{
    // TODO Hoseyn check token role then let them update even these things
    delete req.body.created_date
    delete req.body.is_verified
    delete req.body.is_deleted
    delete req.body.user_id

    const picture = req.files ? req.files.picture : null
    if (picture)
    {
        const picName = new Date().toISOString() + req.headers.authorization._id
        picture.mv(`media/pictures/${picName}`, (err) =>
        {
            if (err)
            {
                res.status(500).send({message: "internal save picture error!"})
                return false
            }
            else
            {
                exchange.findOneAndUpdate({user_id: req.headers.authorization._id, _id: req.body._id}, {...req.body, picture: `media/pictures/${picName}`}, {new: true, useFindAndModify: false, runValidators: true}, (err, updatedExchange) =>
                {
                    if (err) res.status(400).send(err)
                    else if (!updatedExchange) res.status(404).send({message: "not found!"})
                    else res.send(updatedExchange)
                })
            }
        })
    }
    else
    {
        exchange.findOneAndUpdate({user_id: req.headers.authorization._id, _id: req.body._id}, req.body, {new: true, useFindAndModify: false, runValidators: true}, (err, updatedExchange) =>
        {
            if (err) res.status(400).send(err)
            else if (!updatedExchange) res.status(404).send({message: "not found!"})
            else res.send(updatedExchange)
        })
    }
}

const deleteExchangeById = (req, res) =>
{
    exchange.deleteOne({user_id: req.headers.authorization._id, _id: req.params.exchangeId}, (err) =>
    {
        if (err) res.status(400).send(err)
        else res.send({message: "exchange deleted successfully"})
    })
}

const exchangeController = {
    getExchanges,
    updateExchangeById,
    addNewExchange,
    deleteExchangeById,
    getExchangeById,
}

export default exchangeController