import mongoose from "mongoose"

const schema = mongoose.Schema

const packPermissionModel = new schema({
    phone: {
        type: String,
        unique: true,
        minlength: 11,
        maxlength: 11,
        index: true,
        required: "Enter Phone!",
    },
})

export default packPermissionModel