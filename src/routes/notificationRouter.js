import notificationController from "../controllers/notificationController"

const notificationRouter = (app) =>
{
    app.route("/subscribe")
        .post(notificationController.notificationSubscribe)
}

export default notificationRouter