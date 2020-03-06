import viewController from "../controllers/viewController"
import userVideoPackRelationController from "../controllers/userVideoPackRelationController"

const viewRouter = (app) =>
{
    app.route("/view")
        .post(viewController.addView)

    app.route("/view/today/page")
        .get(viewController.getTodayPageViews)

    app.route("/view/today/video")
        .get(viewController.getTodayVideoViews)

    app.route("/view/today/sign-up")
        .get(viewController.getTodaySignUps)

    app.route("/view/today/pack-users")
        .get(userVideoPackRelationController.getTodayUserVideoPack)
}

export default viewRouter