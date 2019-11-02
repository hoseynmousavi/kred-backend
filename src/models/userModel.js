import mongoose from "mongoose"

const model = mongoose.Schema

// const fields = [phone, password, role, email, email_verified, name, major, birth_date, university, avatar, created_date]

const userModel = new model({
    phone: {
        type: String,
        unique: true,
        minlength: 11,
        maxlength: 11,
        index: true,
        required: "Enter Phone!",
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 30,
        required: "Enter Password!",
    },
    role: { // user & admin & translator
        type: String,
        default: "user",
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
    },
    email_verified: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
    },
    major: {
        type: String,
    },
    birth_date: {
        type: String,
        minlength: 8,
        maxlength: 10,
    },
    university: {
        type: String,
    },
    avatar: {
        type: String,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default userModel