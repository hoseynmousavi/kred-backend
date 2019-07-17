import mongoose from 'mongoose'

const model = mongoose.Schema

const userModel = new model({
    name: {
        type: String,
        required: 'Enter Name!',
    },
    phone: {
        type: Number,
        unique: true,
        required: 'Enter Phone!',
    },
    email: {
        type: String,
        unique: true,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default userModel