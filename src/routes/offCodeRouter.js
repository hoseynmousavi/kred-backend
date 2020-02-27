import offCodeController from "../controllers/offCodeController"

const offCodeRouter = (app) =>
{
    app.route("/off-code-verify")
        .post(offCodeController.validateCode)

    app.route("/off-code")
        .get(offCodeController.getOffCodes)
        .post(offCodeController.addOffCode)

    app.route("/off-code/users/:code_id")
        .get(offCodeController.getOffCodeConsumers)
}

export default offCodeRouter