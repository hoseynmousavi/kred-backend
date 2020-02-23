import buyVideoPackController from "../controllers/buyVideoPackController"

const buyVideoPackRouter = (app) =>
{
    app.route("/buy-video-pack").post(buyVideoPackController.getLinkForPay)

    app.route("/payment").post(buyVideoPackController.returnAfterPayment)
}

export default buyVideoPackRouter