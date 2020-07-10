import userController from "../controllers/userController"

const userRouter = (app) =>
{
    app.route("/user")
        .get(userController.getUsersForAdmins)
        .post(userController.addNewUser)
        .patch(userController.updateUserById)

    app.route("/user/phone_check")
        .post(userController.phoneCheck)

    app.route("/user/email_check")
        .post(userController.emailCheck)

    app.route("/user/username_check")
        .post(userController.usernameCheck)

    app.route("/user/login")
        .post(userController.userLogin)

    app.route("/user/verify-token")
        .post(userController.verifyTokenRoute)

    app.route("/user/forget-password")
        .post(userController.sendForgottenPassword)

    app.route("/user/block")
        .post(userController.addBlockedUser)
}

export default userRouter