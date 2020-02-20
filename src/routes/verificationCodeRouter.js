import verificationCodeController from "../controllers/verificationCodeController"

const verificationCodeRouter = (app) =>
{
    app.route("/code").post(verificationCodeController.sendVerificationCode)
}

export default verificationCodeRouter