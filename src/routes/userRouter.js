const userRouter = (app) =>
{
    app.route('/user')
        .get((req, res) => res.send('get'))
        .post((req, res) => res.send('post'))

    app.route('/user/:id')
        .patch((req, res) => res.send('patch'))
        .delete((req, res) => res.send('delete'))
}

export default userRouter