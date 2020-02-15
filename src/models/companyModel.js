import mongoose from "mongoose"

const schema = mongoose.Schema

const companyModel = new schema({
    name: {
        type: String,
        required: "Enter Name!",
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