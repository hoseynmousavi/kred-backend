import mongoose from "mongoose"

const schema = mongoose.Schema

const educationLikeModel = new schema({
    user_id: {
        type: schema.Types.ObjectId,
        required: "Enter user_id!",
    },
    education_id: {
        type: schema.Types.ObjectId,
        required: "Enter education_id!",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

educationLikeModel.index({user_id: 1, education_id: 1}, {unique: true})

export default educationLikeModel