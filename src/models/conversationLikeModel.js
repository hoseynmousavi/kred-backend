import mongoose from "mongoose"

const schema = mongoose.Schema

const conversationLikeModel = new schema({
    user_id: {
        type: schema.Types.ObjectId,
        required: "Enter user_id!",
    },
    conversation_id: {
        type: schema.Types.ObjectId,
        required: "Enter conversation_id!",
    },
    created_date: {
        type: Date,
        default: Date.now(),
    },
})

conversationLikeModel.index({user_id: 1, conversation_id: 1}, {unique: true})

export default conversationLikeModel