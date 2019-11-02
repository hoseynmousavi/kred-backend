import mongoose from "mongoose"
import cityModel from "../models/cityModel"

const city = mongoose.model("city", cityModel)

const getCities = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 9
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    city.find({}, {}, {skip, limit}, (err, cities) =>
    {
        if (err) res.status(400).send(err)
        else res.send(cities)
    })
}

const cityController = {
    getCities,
}

export default cityController