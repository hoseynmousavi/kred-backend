import mongoose from "mongoose"

const schema = mongoose.Schema

const lessonModel = new schema({
    title: {
        type: String,
        minlength: 1,
        maxlength: 60,
        required: "Enter title!",
    },
    svg: {
        type: String,
        required: "Enter svg!",
    },
    video_pack_id: {
        type: [schema.Types.ObjectId],
        ref: "videoPack",
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

export default lessonModel