import mongoose from "mongoose"
import quizModel from "../models/quizModel"
import quizQuestionModel from "../models/quizQuestionModel"
import saveFile from "../functions/saveFile"

const quiz = mongoose.model("quiz", quizModel)
const question = mongoose.model("quizQuestion", quizQuestionModel)

const getQuiz = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        quiz.find(null, (err, quizes) =>
        {
            if (err) res.status(400).send(err)
            else
            {
                question.find(null, (err, questions) =>
                {
                    if (err) res.status(400).send(err)
                    else res.send({quizes, questions})
                })
            }
        })
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const getQuizById = (req, res) =>
{
    const {quiz_id} = req.params
    quiz.findOne({_id: quiz_id}, (err, takenQuiz) =>
    {
        if (err) res.status(400).send(err)
        else if (!takenQuiz) res.status(404).send({message: "not found"})
        else
        {
            const takenQuizJson = takenQuiz.toJSON()
            question.find({quiz_id}, (err, questions) =>
            {
                if (err) res.status(400).send(err)
                else
                {
                    takenQuizJson.questions = questions
                    res.send(takenQuizJson)
                }
            })
        }
    })
}

const addQuiz = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        new quiz(req.body).save((err, createdQuiz) =>
        {
            if (err) res.status(400).send(err)
            else res.send(createdQuiz)
        })
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const addQuestion = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const file = req.files ? req.files.picture : null
        saveFile({file, folder: "pictures"})
            .then(picture =>
            {
                const {quiz_id, title, first_answer, second_answer, third_answer, forth_answer, correct_answer} = req.body
                new question({quiz_id, title, first_answer, second_answer, third_answer, forth_answer, correct_answer, picture}).save((err, created) =>
                {
                    if (err) res.status(400).send(err)
                    else res.send(created)
                })
            })
            .catch((err) => res.status(400).send(err))
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const removeQuiz = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const {quiz_id} = req.params
        quiz.deleteOne({_id: quiz_id}, err =>
        {
            if (err) res.status(400).send(err)
            else res.send({message: "ok"})
        })
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const removeQuestion = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const {question_id} = req.params
        question.deleteOne({_id: question_id}, err =>
        {
            if (err) res.status(400).send(err)
            else res.send({message: "ok"})
        })
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const updateQuestion = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const file = req.files ? req.files.picture : null
        if (file)
        {
            saveFile({file, folder: "pictures"})
                .then(picture =>
                {
                    question.findOneAndUpdate(
                        {_id: req.body.question_id},
                        {...req.body, picture},
                        {new: true, useFindAndModify: false, runValidators: true}, (err, updatedConversation) =>
                        {
                            if (err) res.status(400).send(err)
                            else res.send(updatedConversation)
                        },
                    )
                })
                .catch((err) => res.status(400).send(err))
        }
        else
        {
            question.findOneAndUpdate(
                {_id: req.body.question_id},
                {...req.body},
                {new: true, useFindAndModify: false, runValidators: true}, (err, updatedConversation) =>
                {
                    if (err) res.status(400).send(err)
                    else res.send(updatedConversation)
                },
            )
        }
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const quizController = {
    getQuiz,
    getQuizById,
    addQuiz,
    addQuestion,
    removeQuiz,
    removeQuestion,
    updateQuestion,
}

export default quizController