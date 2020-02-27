import viewController from "../controllers/viewController"
import userVideoPackRelationController from "../controllers/userVideoPackRelationController"

const viewRouter = (app) =>
{
    app.route("/view")
        .post(viewController.addView)
        .get(viewController.getViews)

    app.route("/view/pack-users")
        .get(userVideoPackRelationController.getUserVideoPack)
}

export default viewRouter