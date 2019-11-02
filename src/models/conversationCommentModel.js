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
        minlength: 1,
        required: "Enter description!",
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    created_date: {
        type: Date,
        default: Date.now(),
    },
})

export default conversationCommentModel