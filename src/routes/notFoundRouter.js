const notFoundRooter = (app) =>
{
    app.route("*")
        .get((req, res) => res.status(400).send("seems to be a wrong get! this url doesnt exist on api!"))
        .post((req, res) => res.status(400).send("seems to be a wrong post! this url doesnt exist on api!"))
        .patch((req, res) => res.status(400).send("seems to be a wrong patch! this url doesnt exist on api!"))
        .delete((req, res) => res.status(400).send("seems to be a wrong delete! this url doesnt exist on api!"))
}

export default notFoundRooter