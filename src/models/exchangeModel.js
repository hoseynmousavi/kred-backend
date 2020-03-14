import mongoose from "mongoose"

const schema = mongoose.Schema

const exchangeModel = new schema({
    title: {
        type: String,
        minlength: 1,
        maxlength: 60,
        required: "Enter title!",
    },
    price: {
        type: Number,
        required: "Enter price!",
    },
    lined: {
        type: String,
        enum: ["ندارد", "کم", "متوسط", "زیاد"],
        required: "Enter lined!",
    },
    telegram: {
        type: String,
    },
    whatsapp: {
        type: String,
    },
    phone: {
        type: String,
        minlength: 11,
        maxlength: 11,
    },
    description: {
        type: String,
        required: "Enter description!",
    },
    picture: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    city_id: {
        type: schema.Types.ObjectId,
        required: "Enter city_id!",
        ref: "city",
    },
    user_id: {
        type: schema.Types.ObjectId,
        required: "Enter user_id!",
        ref: "user",
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    is_verified: {
        type: Boolean,
        default: false,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default exchangeModel