import offCodeController from "../controllers/offCodeController"


const offCodeRouter = (app) =>
{
    app.route("/off-code-verify")
        .post(offCodeController.validateCode)

    app.route("/off-code")
        .post(offCodeController.addOffCode)
}

export default offCodeRouter