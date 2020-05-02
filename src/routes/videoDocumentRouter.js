import videoDocumentController from "../controllers/videoDocumentController"

const videoDocumentRouter = (app) =>
{
    app.route("/video-document")
        .post(videoDocumentController.addVideoDocument)

    app.route("/video-document/:video_id")
        .get(videoDocumentController.getVideoDocumentsByVideoId)
}

export default videoDocumentRouter