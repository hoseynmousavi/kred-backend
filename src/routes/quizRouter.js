import quizController from "../controllers/quizController"

const quizRouter = (app) =>
{
    app.route("/quiz")
        .get(quizController.getQuiz)
        .post(quizController.addQuiz)

    app.route("/quiz/question")
        .post(quizController.addQuestion)

    app.route("/quiz/question/:question_id")
        .patch(quizController.updateQuestion)
        .delete(quizController.removeQuestion)

    app.route("/quiz/:quiz_id")
        .get(quizController.getQuizById)
        .delete(quizController.removeQuiz)
}

export default quizRouter