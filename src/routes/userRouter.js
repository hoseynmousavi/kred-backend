import userController from "../controllers/userController"

const userRouter = (app) =>
{
    app.route("/user")
    // .get(userController.getUsers)
        .post(userController.addNewUser)
        .patch(userController.updateUserById)

    app.route("/user/phone_check")
        .post(userController.phoneCheck)

    // app.route("/user/:userId")
    //     .get(userController.getUserById)

    app.route("/user/login")
        .post(userController.userLogin)
}

export default userRouter