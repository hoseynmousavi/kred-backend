import exchangeController from "../controllers/exchangeController"

const exchangeRouter = (app) =>
{
    app.route("/exchange")
        .get(exchangeController.getExchanges)
        .post(exchangeController.addNewExchange)
        .patch(exchangeController.updateExchangeById)

    app.route("/exchange/:exchangeId")
        .get(exchangeController.getExchangeById)
        .delete(exchangeController.deleteExchangeById)
}

export default exchangeRouter