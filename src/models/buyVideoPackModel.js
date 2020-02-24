import mongoose from "mongoose"

const schema = mongoose.Schema

const buyVideoPackModel = new schema({
    user_id: {
        type: schema.Types.ObjectId,
        required: "Enter user_id!",
        ref: "user",
    },
    video_pack_id: {
        type: schema.Types.ObjectId,
        ref: "videoPack",
        required: "Enter video_pack_id!",
    },
    off_code_id: {
        type: schema.Types.ObjectId,
        ref: "offCode",
    },
    price: {
        type: Number,
        required: "Enter price!",
    },
    link: {
        type: String,
    },
    id_pay_id: {
        type: String,
    },
    track_id: {
        type: String,
    },
    is_done_successful: {
        type: Boolean,
        default: false,
    },
    payment_successful_date: {
        type: String,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default buyVideoPackModel