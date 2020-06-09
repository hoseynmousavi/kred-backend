import videoDocumentController from "../controllers/videoDocumentController"

const videoDocumentRouter = (app) =>
{
    app.route("/video-document")
        .get(videoDocumentController.getVideoDocuments)
        .post(videoDocumentController.addVideoDocument)

    app.route("/video-document/:video_id")
        .get(videoDocumentController.getVideoDocumentsByVideoId)
        .delete(videoDocumentController.deleteVideoDocument)
}

export default videoDocumentRouter