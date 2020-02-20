import mongoose from "mongoose"

const schema = mongoose.Schema

const verificationCodeModel = new schema({
    code: {
        type: String,
        required: "Enter code!",
    },
    phone: {
        type: String,
        unique: true,
        minlength: 11,
        maxlength: 11,
        required: "Enter Phone!",
    },
})

export default verificationCodeModel