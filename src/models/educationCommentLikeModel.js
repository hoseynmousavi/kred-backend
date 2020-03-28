import mongoose from "mongoose"

const schema = mongoose.Schema

const educationCommentLikeModel = new schema({
    user_id: {
        type: schema.Types.ObjectId,
        required: "Enter user_id!",
    },
    comment_id: {
        type: schema.Types.ObjectId,
        required: "Enter comment_id!",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

educationCommentLikeModel.index({user_id: 1, comment_id: 1}, {unique: true})

export default educationCommentLikeModel