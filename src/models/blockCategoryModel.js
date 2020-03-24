import mongoose from "mongoose"

const schema = mongoose.Schema

const blockCategoryModel = new schema({
    title: {
        type: String,
        minlength: 1,
        maxlength: 60,
        required: "Enter title!",
    },
    block_id: {
        type: schema.Types.ObjectId,
        ref: "block",
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

export default blockCategoryModel