import mongoose from "mongoose"

const schema = mongoose.Schema

const offCodeModel = new schema({
    code: {
        type: String,
        unique: true,
        required: "Enter code!",
    },
    usage: {
        type: Number,
        default: 0,
    },
    amount: {
        type: Number,
        required: "Enter amount!",
    },
    amount_type: {
        type: String,
        enum: ["fix", "percent"],
        default: "fix",
    },
    users_who_user: {
        type: [schema.Types.ObjectId],
        ref: "user",
        default: [],
    },
    max_usage: {
        type: Number,
        default: 1,
    },
    expire_date: {
        type: Date,
        default: new Date().setDate(new Date().getDate() + 15),
    },
})

export default offCodeModel