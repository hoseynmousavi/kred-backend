import mongoose from "mongoose"

const schema = mongoose.Schema

const userModel = new schema({
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
    username: {
        type: String,
        unique: true,
        minlength: 3,
        maxlength: 40,
        index: true,
        validate: /^[a-zA-Z]+[a-zA-Z0-9_.-]+$/,
        required: "Enter phone!",
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
        validate: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/,
        required: "Enter email!",
    },
    email_verified: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        trim: true,
    },
    major: {
        type: String,
        trim: true,
    },
    grade: {
        type: String,
        trim: true,
    },
    entrance: {
        type: String,
        trim: true,
    },
    birth_date: {
        type: String,
        minlength: 8,
        maxlength: 10,
        trim: true,
    },
    university: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
        trim: true,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default userModel