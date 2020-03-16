import mongoose from "mongoose"

const schema = mongoose.Schema

const notificationModel = new schema({
    token: {
        type: String,
        required: "Enter token!",
    },
    user_id: {
        type: schema.Types.ObjectId,
        required: "Enter user_id!",
        ref: "user",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default notificationModel