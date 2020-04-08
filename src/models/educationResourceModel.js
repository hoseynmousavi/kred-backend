import mongoose from "mongoose"

const schema = mongoose.Schema

const educationResourceModel = new schema({
    title: {
        type: String,
        required: "Enter title!",
    },
    likes_count: {
        type: Number,
        default: 0,
    },
    comments_count: {
        type: Number,
        default: 0,
    },
    university: {
        type: String,
    },
    teacher: {
        type: String,
    },
    pages_count: {
        type: String,
    },
    subject: {
        type: String,
    },
    writer: {
        type: String,
    },
    is_many: {
        type: Boolean,
        required: "Enter is_many!",
    },
    type: {
        type: String,
        enum: ["handout", "voice", "question", "summary"],
        required: "Enter type!",
    },
    lesson_category_id: {
        type: schema.Types.ObjectId,
        ref: "lessonCategory",
    },
    block_category_id: {
        type: schema.Types.ObjectId,
        ref: "blockCategory",
    },
    lesson_id: {
        type: schema.Types.ObjectId,
        ref: "lesson",
    },
    block_id: {
        type: schema.Types.ObjectId,
        ref: "block",
    },
    picture: {
        type: String,
    },
    file: {
        type: String,
        required: "Enter file!",
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

export default educationResourceModel