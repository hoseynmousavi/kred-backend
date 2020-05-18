import mongoose from "mongoose"

const schema = mongoose.Schema

const quizModel = new schema({
    title: {
        type: String,
        required: "Enter title!",
    },
    minutes: {
        type: Number,
        required: "enter minutes!",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default quizModel