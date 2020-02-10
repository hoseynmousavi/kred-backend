import viewController from "../controllers/viewController"

const viewRouter = (app) => app.route("/view").post(viewController.addView)

export default viewRouter