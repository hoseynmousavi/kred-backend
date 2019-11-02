import cityController from "../controllers/cityController"

const cityRouter = (app) =>
{
    app.route("/city")
        .get(cityController.getCities)
}

export default cityRouter