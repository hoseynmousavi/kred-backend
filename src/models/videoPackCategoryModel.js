import mongoose from "mongoose"

const schema = mongoose.Schema

const videoPackCategoryModel = new schema({
    video_pack_id: {
        type: schema.Types.ObjectId,
        required: "Enter video_pack_id!",
        ref: "videoPack",
    },
    title: {
        type: String,
        minlength: 1,
        maxlength: 60,
        required: "Enter title!",
    },
    order: {
        type: Number,
        required: "Enter order!",
    },
    picture: {
        type: String,
    },
})

export default videoPackCategoryModel