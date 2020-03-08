import mongoose from "mongoose"
import exchangeModel from "../models/exchangeModel"
import exchangeCategoryRelationModel from "../models/exchangeCategoryRelationModel"
import mailHelper from "../functions/mailHelper"
import categoryModel from "../models/categoryModel"

const exchange = mongoose.model("exchange", exchangeModel)
const exchangeCategory = mongoose.model("exchangeCategory", exchangeCategoryRelationModel)
const category = mongoose.model("category", categoryModel)

const getExchanges = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 9
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    let query = {is_deleted: false, is_verified: true}
    const options = {sort: "-created_date", skip, limit}
    const fields = "title price lined telegram whatsapp phone description picture city_id user_id created_date"

    if (req.query.user_id) query.user_id = req.query.user_id

    if (req.query.searchTitle) query.title = new RegExp(req.query.searchTitle)

    if (req.query.searchCategories)
    {
        const searchCategoriesArr = req.query.searchCategories.split(",")
        exchangeCategory.find(
            {category_id: {$in: searchCategoriesArr.reduce((sum, item) => [...sum, item], [])}},
            (err, relations) =>
            {
                query._id = {$in: relations.reduce((sum, item) => [...sum, item.exchange_id], [])}
                exchange.find(
                    query,
                    fields,
                    options,
                    (err, exchanges) => err ? res.status(400).send(err) : res.send(exchanges),
                )
            },
        )
    }
    else exchange.find(
        query,
        fields,
        options,
        (err, exchanges) => err ? res.status(400).send(err) : res.send(exchanges),
    )
}

const getExchangeById = (req, res) =>
{
    exchange.findById(req.params.exchangeId, (err, takenExchange) =>
    {
        if (err) res.status(500).send(err)
        else if (!takenExchange || takenExchange.is_deleted || !takenExchange.is_verified) res.status(404).send({message: "not found!"})
        else
        {
            const exchangeJson = takenExchange.toJSON()
            delete exchangeJson.is_deleted
            delete exchangeJson.is_verified
            exchangeCategory.find({exchange_id: exchangeJson._id}, (err, relations) =>
            {
                if (err) res.status(500).send(err)
                else
                {
                    category.find(
                        {_id: {$in: relations.reduce((sum, item) => [...sum, item.category_id], [])}},

                        (err, categories) =>
                        {
                            if (err) res.status(500).send(err)
                            else res.send({...exchangeJson, categories})
                        },
                    )
                }
            })
        }
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
                        const categories = JSON.parse(req.body.categories)
                        categories.forEach(item => new exchangeCategory({category_id: item, exchange_id: createdExchange._id}).save())
                        if (req.headers.authorization.role !== "admin")
                        {
                            const mails = ["aidin.sh1377@gmail.com", "miri1888@gmail.com", "erfanv1@gmail.com", "eziaie1998@gmail.com", "zmahramian@gmail.com", "hoseyn.mousavi78@gmail.com"]
                            for (let i = 0; i < mails.length; i++)
                            {
                                setTimeout(() =>
                                        mailHelper.sendMail({
                                            subject: "آگهی جدید داریم!",
                                            text: `آگهی جدید : ${createdExchange.title}`,
                                            receivers: mails[i],
                                        })
                                    , i * 5000)
                            }
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
    if (req.params.exchangeId)
    {
        exchange.findOneAndUpdate({user_id: req.headers.authorization._id, _id: req.params.exchangeId}, {is_deleted: true}, {new: true, useFindAndModify: false, runValidators: true}, (err, _) =>
        {
            if (err) res.status(500).send(err)
            else res.send({message: "exchange deleted successfully"})
        })
    }
    else res.status(400).send({message: "send exchangeId as param"})
}

const exchangeController = {
    getExchanges,
    updateExchangeById,
    addNewExchange,
    deleteExchangeById,
    getExchangeById,
}

export default exchangeController