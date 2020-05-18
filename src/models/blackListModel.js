import mongoose from "mongoose"

const schema = mongoose.Schema

const blackListModel = new schema({
    phone: {
        type: String,
        unique: true,
        minlength: 11,
        maxlength: 11,
        index: true,
        required: "Enter phone!",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default blackListModel