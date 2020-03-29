import mongoose from "mongoose"
import categoryModel from "../models/categoryModel"

const category = mongoose.model("category", categoryModel)

const getCategories = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 9
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    category.find(null, null, {skip, limit}, (err, categories) =>
    {
        if (err) res.status(400).send(err)
        else res.send(categories)
    })
}

const getCategoryById = (req, res) =>
{
    category.findById(req.params.category_id, (err, takenCategory) =>
    {
        if (err) res.status(500).send(err)
        else if (!takenCategory) res.status(404).send({message: "not found!"})
        else res.send(takenCategory)
    })
}

const categoryController = {
    getCategories,
    getCategoryById,
}

export default categoryController