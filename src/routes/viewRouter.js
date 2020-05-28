import viewController from "../controllers/viewController"
import userVideoPackRelationController from "../controllers/userVideoPackRelationController"

const viewRouter = (app) =>
{
    app.route("/view")
        .post(viewController.addView)

    app.route("/view/all/page")
        .get(viewController.getAllPageViews)

    app.route("/view/all/video")
        .get(viewController.getAllVideoViews)

    app.route("/view/all/sign-up")
        .get(viewController.getAllSignUps)

    app.route("/view/all/pack-users")
        .get(userVideoPackRelationController.getAllUserVideoPack)

    app.route("/view/today/page")
        .get(viewController.getTodayPageViews)

    app.route("/view/today/video")
        .get(viewController.getTodayVideoViews)

    app.route("/view/today/sign-up")
        .get(viewController.getTodaySignUps)

    app.route("/view/today/user-view")
        .get(viewController.getTodayUserViews)

    app.route("/view/today/pack-users")
        .get(userVideoPackRelationController.getTodayUserVideoPack)

    app.route("/view/users-diagram/:step")
        .get(viewController.usersDiagram)
}

export default viewRouter