import packController from "../controllers/videoPackController"

const videoPackRouter = (app) =>
{
    app.route("/video-pack")
        .get(packController.getVideoPacks)
        .post(packController.addNewVideoPack)

    app.route("/video-pack/:video_pack_id")
        .get(packController.getVideoPackById)
}

export default videoPackRouter