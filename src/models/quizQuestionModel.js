import mongoose from "mongoose"

const schema = mongoose.Schema

const quizQuestionModel = new schema({
    quiz_id: {
        type: schema.Types.ObjectId,
        required: "Enter quiz_id!",
    },
    title: {
        type: String,
        required: "Enter title!",
    },
    first_answer: {
        type: String,
        required: "enter first_answer!",
    },
    second_answer: {
        type: String,
        required: "enter second_answer!",
    },
    third_answer: {
        type: String,
        required: "enter third_answer!",
    },
    forth_answer: {
        type: String,
        required: "enter forth_answer!",
    },
    correct_answer: {
        type: Number,
        required: "enter correct_answer!",
    },
    picture: {
        type: String,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default quizQuestionModel