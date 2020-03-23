import classController from "../controllers/classController"

const classRouter = (app) =>
{
    app.route("/lesson")
        .get(classController.getLessons)
        .post(classController.addLesson)

    app.route("/block")
        .get(classController.getBlocks)
        .post(classController.addBlock)
}

export default classRouter