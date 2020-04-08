import mongoose from "mongoose"

const schema = mongoose.Schema

const videoModel = new schema({
    video_pack_category_id: {
        type: schema.Types.ObjectId,
        required: "Enter video_pack_category_id!",
        ref: "videoPackCategory",
    },
    title: {
        type: String,
        required: "Enter title!",
    },
    is_free: {
        type: Boolean,
        default: false,
    },
    video_url: {
        type: String,
        required: "Enter video_url!",
    },
    subtitle_url: {
        type: String,
    },
    duration_min: {
        type: Number,
        required: "Enter duration_min!",
    },
    order: {
        type: Number,
        required: "Enter order!",
    },
    user_id: {
        type: schema.Types.ObjectId,
        required: "Enter user_id!",
        ref: "user",
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

export default videoModel