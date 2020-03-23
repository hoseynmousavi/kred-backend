import mongoose from "mongoose"

const schema = mongoose.Schema

const blockModel = new schema({
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
    is_deleted: {
        type: Boolean,
        default: false,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default blockModel