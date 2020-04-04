import mongoose from "mongoose"

const schema = mongoose.Schema

const educationSaveModel = new schema({
    user_id: {
        type: schema.Types.ObjectId,
        required: "Enter user_id!",
    },
    education_id: {
        type: schema.Types.ObjectId,
        required: "Enter education_id!",
    },
    education_type: {
        type: String,
        enum: ["handout", "voice", "question", "summary"],
        required: "Enter type!",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

educationSaveModel.index({user_id: 1, education_id: 1}, {unique: true})

export default educationSaveModel