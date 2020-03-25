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
}

export default classRouter