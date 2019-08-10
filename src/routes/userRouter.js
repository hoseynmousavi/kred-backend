import userController from '../controllers/userController'

const userRouter = (app) =>
{
    app.route('/user')
        .get(userController.getUsers)
        .post(userController.addNewUser)
        .patch(userController.updateUserById)

    app.route('/user/login')
        .post(userController.userLogin)

    app.route('/user/:userId')
        .get(userController.getUserById)
        .delete(userController.deleteUserById)
}

export default userRouter