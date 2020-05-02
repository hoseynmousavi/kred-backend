import mongoose from "mongoose"

const schema = mongoose.Schema

const videoDocumentModel = new schema({
    video_id: {
        type: schema.Types.ObjectId,
        required: "Enter video_id!",
    },
    file: {
        type: String,
        required: "Enter file!",
    },
    type: {
        type: String,
        enum: ["image", "pdf"],
        required: "Enter type!",
    },
    description: {
        type: String,
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

export default videoDocumentModel