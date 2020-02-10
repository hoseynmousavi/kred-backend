import viewController from "../controllers/viewController"

const viewRouter = (app) =>
    app.route("/view")
        .post(viewController.addView)
        .get(viewController.getViews)

export default viewRouter