import mongoose from "mongoose"

const schema = mongoose.Schema

const companyModel = new schema({
    name: {
        type: String,
        required: "Enter name!",
    },
    english_name: {
        type: String,
        required: "Enter english_name!",
    },
    description: {
        type: String,
        required: "Enter description!",
    },
    picture: {
        type: String,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default companyModel