import mongoose from "mongoose"

const schema = mongoose.Schema

const companyCategoryModel = new schema({
    company_id: {
        type: schema.Types.ObjectId,
        required: "Enter company_id!",
        ref: "company",
    },
    title: {
        type: String,
        required: "Enter title!",
    },
    order: {
        type: Number,
        required: "Enter order!",
    },
    picture: {
        type: String,
    },
})

export default companyCategoryModel