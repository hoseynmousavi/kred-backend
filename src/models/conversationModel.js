import mongoose from "mongoose"

const schema = mongoose.Schema

const conversationModel = new schema({
    title: {
        type: String,
        required: "Enter title!",
    },
    interviewee_name: {
        type: String,
        required: "Enter interviewee_name!",
    },
    interviewee_bio: {
        type: String,
        required: "Enter interviewee_bio!",
    },
    audio: {
        type: String,
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