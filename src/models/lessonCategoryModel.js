import mongoose from "mongoose"

const schema = mongoose.Schema

const lessonCategoryModel = new schema({
    title: {
        type: String,
        minlength: 1,
        maxlength: 60,
        required: "Enter title!",
    },
    lesson_id: {
        type: schema.Types.ObjectId,
        ref: "lesson",
        required: "Enter lesson_id!",
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

export default lessonCategoryModel