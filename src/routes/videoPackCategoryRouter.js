import videoPackCategoryController from "../controllers/videoPackCategoryController"

const videoPackCategoryRouter = (app) =>
{
    app.route("/video-pack-category")
        .get(videoPackCategoryController.getVideoPackCategories)
        .post(videoPackCategoryController.addNewVideoPackCategory)
}

export default videoPackCategoryRouter