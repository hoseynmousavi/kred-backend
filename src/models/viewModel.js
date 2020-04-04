import mongoose from "mongoose"

const schema = mongoose.Schema

const viewModel = new schema({
    user_id: {
        type: schema.Types.ObjectId,
        ref: "user",
        index: true,
    },
    type: {
        type: String,
        enum: ["page", "video"],
        required: "Enter type!",
        index: true,
    },
    content: {
        type: String,
        required: "Enter content!",
        index: true,
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