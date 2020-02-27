import videoController from "../controllers/videoController"

const videoRouter = (app) =>
{
    app.route("/video").post(videoController.addNewVideo)

    app.route("/video/free").get(videoController.getFreeVideos)
}

export default videoRouter