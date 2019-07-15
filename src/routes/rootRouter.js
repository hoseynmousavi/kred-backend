const rootRouter = (app) =>
{
    app.route('/')
        .get((req, res) => res.send('welcome to the Kred.ir api'))
}

export default rootRouter