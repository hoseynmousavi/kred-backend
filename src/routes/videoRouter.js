import videoController from "../controllers/videoController"

const videoRouter = (app) =>
{
    app.route("/video")
        .get(videoController.getVideos)
        .post(videoController.addNewVideo)
}

export default videoRouter