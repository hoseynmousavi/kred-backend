import userController from "../controllers/userController"

const userRouter = (app) =>
{
    app.route("/user")
        // .get(userController.getUsers)
        .post(userController.addNewUser)
        .patch(userController.updateUserById)

    app.route("/user/:userId")
        .get(userController.getUserById)

    app.route("/user/login")
        .post(userController.userLogin)
}

export default userRouter