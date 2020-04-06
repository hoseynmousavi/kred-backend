import siteMapController from "../controllers/siteMapController"

const siteMapRouter = (app) =>
{
    app.route("/site-map")
        .get(siteMapController.getSiteMap)
}

export default siteMapRouter