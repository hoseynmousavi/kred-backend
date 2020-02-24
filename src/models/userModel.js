import mongoose from "mongoose"

const model = mongoose.Schema

// const fields = [phone, phone_verified, password, role, email, email_verified, name, major, grade, entrance, birth_date, university, avatar, created_date]

const userModel = new model({
    phone: {
        type: String,
        unique: true,
        minlength: 11,
        maxlength: 11,
        index: true,
        required: "Enter phone!",
    },
    phone_verified: {
        type: Boolean,
        default: true,
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 30,
        required: "Enter password!",
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        required: "Enter role!",
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
    grade: {
        type: String,
    },
    entrance: {
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