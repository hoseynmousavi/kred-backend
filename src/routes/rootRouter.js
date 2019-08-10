const rootRouter = (app) =>
{
    app.route("/")
        .get((req, res) => res.send("welcome to the Kred.ir api"))
        .post((req, res) => res.send("welcome to the Kred.ir api"))
        .patch((req, res) => res.send("welcome to the Kred.ir api"))
        .delete((req, res) => res.send("welcome to the Kred.ir api"))
}

export default rootRouter