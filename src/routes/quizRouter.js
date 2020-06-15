import quizController from "../controllers/quizController"

const quizRouter = (app) =>
{
    app.route("/quiz")
        .get(quizController.getQuiz)
        .post(quizController.addQuiz)

    app.route("/quiz/question")
        .patch(quizController.updateQuestion)
        .post(quizController.addQuestion)

    app.route("/quiz/question/:question_id")
        .delete(quizController.removeQuestion)

    app.route("/quiz/:quiz_id")
        .get(quizController.getQuizById)
        .delete(quizController.removeQuiz)
}

export default quizRouter