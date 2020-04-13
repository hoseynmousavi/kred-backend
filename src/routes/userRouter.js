import userController from "../controllers/userController"

const userRouter = (app) =>
{
    app.route("/user")
        .post(userController.addNewUser)
        .patch(userController.updateUserById)

    app.route("/user/phone_check")
        .post(userController.phoneCheck)

    app.route("/user/username_check")
        .post(userController.usernameCheck)

    app.route("/user/login")
        .post(userController.userLogin)

    app.route("/user/verify-token")
        .post(userController.verifyTokenRoute)

    app.route("/user/forget-password")
        .post(userController.sendForgottenPassword)
}

export default userRouter