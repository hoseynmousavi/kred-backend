import userController from '../controllers/userController'

const userRouter = (app) =>
{
    app.route('/user')
        .get(userController.getUsers)
        .post(userController.addNewUser)

    app.route('/user/:userId')
        .get(userController.getUserById)
        .patch(userController.updateUserById)
        .delete(userController.deleteUserById)
}

export default userRouter