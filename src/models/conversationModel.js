import mongoose from "mongoose"

const schema = mongoose.Schema

const conversationModel = new schema({
    title: {
        type: String,
        required: "Enter title!",
    },
    description: {
        type: String,
        required: "Enter description!",
    },
    bold_description: {
        type: String,
    },
    picture: {
        type: String,
        required: "Enter picture!",
    },
    likes_count: {
        type: Number,
        default: 0,
    },
    comments_count: {
        type: Number,
        default: 0,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default conversationModel