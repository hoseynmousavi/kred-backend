import packController from "../controllers/videoPackController"

const videoPackRouter = (app) =>
{
    app.route("/video-pack")
        .get(packController.getVideoPacks)
        .post(packController.addNewVideoPack)
}

export default videoPackRouter