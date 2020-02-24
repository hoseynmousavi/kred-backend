import mongoose from "mongoose"

const schema = mongoose.Schema

const viewModel = new schema({
    user_id: {
        type: schema.Types.ObjectId,
        ref: "user",
    },
    type: {
        type: String,
        enum: ["page", "video"],
        required: "Enter type!",
    },
    content: {
        type: String,
        required: "Enter content!",
    },
    content_id: {
        type: schema.Types.ObjectId,
        ref: "user",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default viewModel