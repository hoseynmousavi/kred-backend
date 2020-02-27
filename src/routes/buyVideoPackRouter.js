import buyVideoPackController from "../controllers/buyVideoPackController"
import userVideoPackRelationController from "../controllers/userVideoPackRelationController"

const buyVideoPackRouter = (app) =>
{
    app.route("/buy-video-pack").post(buyVideoPackController.getLinkForPay)

    app.route("/payment").post(buyVideoPackController.returnAfterPayment)
}

export default buyVideoPackRouter