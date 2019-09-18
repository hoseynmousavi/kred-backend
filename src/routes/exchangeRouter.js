import exchangeController from "../controllers/exchangeController"

const exchangeRouter = (app) =>
{
    app.route("/exchange")
        .get(exchangeController.getExchanges)
        .post(exchangeController.addNewExchange)
        .patch(exchangeController.updateExchangeById)
        .delete(exchangeController.deleteExchangeById)

    app.route("/exchange/:exchangeId")
        .get(exchangeController.getExchangeById)
}

export default exchangeRouter