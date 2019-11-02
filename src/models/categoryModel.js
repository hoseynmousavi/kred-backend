import mongoose from "mongoose"

const schema = mongoose.Schema

const categoryModel = new schema({
    name: {
        type: String,
        required: "Enter title!",
    },
    parent_id: {
        type: schema.Types.ObjectId,
        ref: "category",
    },
    description: {
        type: String,
    },
    picture: {
        type: String,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default categoryModel