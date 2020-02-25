import mailController from "../controllers/mailController"

const mailRouter = (app) =>
{
    app.route("/mail").post(mailController.sendMail)
}

export default mailRouter