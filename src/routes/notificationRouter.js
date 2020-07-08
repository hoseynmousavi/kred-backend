import notificationController from "../controllers/notificationController"

const notificationRouter = (app) =>
{
    app.route("/subscribe")
        .post(notificationController.notificationSubscribe)

    app.route("/send-notification")
        .post(notificationController.sendNotificationForAdmins)
}

export default notificationRouter