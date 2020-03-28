import classController from "../controllers/classController"

const classRouter = (app) =>
{
    app.route("/lesson")
        .get(classController.getLessons)
        .post(classController.addLesson)

    app.route("/lesson/category")
        .get(classController.getLessonCategories)
        .post(classController.addLessonCategory)

    app.route("/lesson/:lesson_id")
        .get(classController.getLessonById)

    app.route("/block")
        .get(classController.getBlocks)
        .post(classController.addBlock)

    app.route("/block/category")
        .get(classController.getBlockCategories)
        .post(classController.addBlockCategory)

    app.route("/block/:block_id")
        .get(classController.getBlockById)

    app.route("/education-resource")
        .get(classController.getEducationResource)
        .post(classController.addEducationResource)

    app.route("/education-resource/:education_id")
        .get(classController.getEducationResourceById)

    app.route("/education-resource/like")
        .post(classController.addNewLike)

    app.route("/education-resource/like/:educationId")
        .delete(classController.deleteLike)

    app.route("/education-resource/comment/like")
        .post(classController.addNewCommentLike)

    app.route("/education-resource/comment/like/:commentId")
        .delete(classController.deleteCommentLike)

    app.route("/education-resource/comment")
        .post(classController.addNewComment)

    app.route("/education-resource/comments/:educationId")
        .get(classController.getEducationComments)

    app.route("/education-resource/comment/:commentId")
        .delete(classController.deleteComment)
}

export default classRouter