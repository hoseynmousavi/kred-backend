import mongoose from "mongoose"

const schema = mongoose.Schema

const exchangeCategoryRelationModel = new schema({
    exchange_id: {
        type: schema.Types.ObjectId,
        ref: "exchange",
    },
    category_id: {
        type: schema.Types.ObjectId,
        ref: "category",
    },
})

exchangeCategoryRelationModel.index({exchange_id: 1, category_id: 1}, {unique: true})

export default exchangeCategoryRelationModel