import mongoose from "mongoose"

const schema = mongoose.Schema

const conversationCommentModel = new schema({
    user_id: {
        type: schema.Types.ObjectId,
        required: "Enter user_id!",
    },
    conversation_id: {
        type: schema.Types.ObjectId,
        required: "Enter conversation_id!",
    },
    description: {
        type: String,
        minlength: 2,
        required: "Enter description!",
    },
    parent_comment_id: {
        type: schema.Types.ObjectId,
    },
    reply_comment_id: {
        type: schema.Types.ObjectId,
    },
    children_count: {
        type: Number,
        default: 0,
    },
    likes_count: {
        type: Number,
        default: 0,
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

export default conversationCommentModel