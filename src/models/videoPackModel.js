import mongoose from "mongoose"

const schema = mongoose.Schema

const videoPackModel = new schema({
    title: {
        type: String,
        required: "Enter title!",
    },
    price: {
        type: Number,
        required: "Enter price!",
    },
    off_percent: {
        type: Number,
        required: "Enter off_percent!",
    },
    company_category_id: {
        type: schema.Types.ObjectId,
        required: "Enter company_category_id!",
        ref: "company",
    },
    category_id: {
        type: schema.Types.ObjectId,
        required: "Enter category_id!",
        ref: "category",
    },
    user_id: {
        type: schema.Types.ObjectId,
        required: "Enter user_id!",
        ref: "user",
    },
    picture: {
        type: String,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default videoPackModel