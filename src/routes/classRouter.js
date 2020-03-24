import classController from "../controllers/classController"

const classRouter = (app) =>
{
    app.route("/lesson")
        .get(classController.getLessons)
        .post(classController.addLesson)

    app.route("/lesson/category")
        .get(classController.getLessonCategories)
        .post(classController.addLessonCategory)

    app.route("/block")
        .get(classController.getBlocks)
        .post(classController.addBlock)

    app.route("/block/category")
        .get(classController.getBlockCategories)
        .post(classController.addBlockCategory)
}

export default classRouter