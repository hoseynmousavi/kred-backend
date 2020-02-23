import packController from "../controllers/videoPackController"

const videoPackRouter = (app) =>
{
    app.route("/video-pack")
        .get(packController.getVideoPacks)
        .post(packController.addNewVideoPack)

    app.route("/video-pack/:videoPackId")
        .get(packController.getVideoPackById)
}

export default videoPackRouter