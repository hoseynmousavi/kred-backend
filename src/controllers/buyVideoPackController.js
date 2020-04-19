import mongoose from "mongoose"
import videoPackController from "./videoPackController"
import axios from "axios"
import buyVideoPackModel from "../models/buyVideoPackModel"
import userVideoPackRelationController from "./userVideoPackRelationController"
import offCodeController from "./offCodeController"
import data from "../data"
import notificationController from "./notificationController"

const buyVideoPack = mongoose.model("buyVideoPack", buyVideoPackModel)

const getLinkForPay = (req, res) =>
{
    const {video_pack_id, code} = req.body
    const user_id = req.headers.authorization._id

    if (user_id && video_pack_id)
    {
        userVideoPackRelationController.getPermissionsFunc({condition: {user_id, video_pack_id}})
            .then((resultPermission) =>
            {
                if (resultPermission.relations && resultPermission.relations.length > 0) res.status(400).send({message: "bad request!"})
                else
                {
                    videoPackController.getPureVideoPackById({videoPackId: video_pack_id})
                        .then((result) =>
                        {
                            if (code && result.videoPack.off_percent === 0)
                            {
                                offCodeController.validateCodeFunc({code, user_id})
                                    .then((resultCode) =>
                                    {
                                        const {code} = resultCode
                                        shopVideoPack({
                                            user_id,
                                            video_pack_id,
                                            price: result.videoPack.price - (code.amount_type === "fix" ? code.amount : code.amount / 100 * result.videoPack.price),
                                            off_code_id: code._id,
                                            res,
                                        })
                                    })
                                    .catch((resultCode) => res.status(resultCode.status || 500).send(resultCode.err))
                            }
                            else shopVideoPack({user_id, video_pack_id, price: result.videoPack.off_percent !== 0 ? ((100 - result.videoPack.off_percent) / 100) * result.videoPack.price : result.videoPack.price, res})
                        })
                        .catch((err) => res.status(err.status || 500).send(err.err))
                }
            })
            .catch((result) => res.status(result.status || 500).send(result.err))
    }
    else res.status(400).send({message: "bad request!"})
}

const shopVideoPack = ({user_id, video_pack_id, price, off_code_id, res}) =>
{
    const newBuyVideoPack = new buyVideoPack({user_id, video_pack_id, price, off_code_id})
    newBuyVideoPack.save((err, createdOrder) =>
    {
        if (err) res.status(500).send(err)
        else
        {
            axios.post("https://api.idpay.ir/v1.1/payment",
                {
                    order_id: createdOrder._id,
                    amount: price * 10,
                    name: user_id,
                    callback: "https://restful.kred.ir/payment",
                },
                {headers: {"X-API-KEY": data.idPayKey}})
                .then((response) =>
                {
                    if (response.status === 201)
                    {
                        const {id, link} = response.data
                        buyVideoPack.findOneAndUpdate({_id: createdOrder._id}, {link, id_pay_id: id}, {new: true, useFindAndModify: false, runValidators: true}, (err, _) =>
                        {
                            if (err) res.status(500).send(err)
                            else res.send({link})
                        })
                    }
                    else
                    {
                        console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica',consolas,sans-serif; font-weight:900;", response)
                        res.status(500).send({message: "err"})
                    }
                })
                .catch((err) =>
                {
                    console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica',consolas,sans-serif; font-weight:900;", err.response.data)
                    res.status(500).send({message: err.response.data})
                })
        }
    })
}

const returnAfterPayment = (req, res) =>
{
    const {status, track_id, id, order_id, date} = req.body
    if (status == 10)
    {
        axios.post("https://api.idpay.ir/v1.1/payment/verify",
            {order_id, id},
            {headers: {"X-API-KEY": data.idPayKey}})
            .then((response) =>
            {
                if (response.status === 200)
                {
                    buyVideoPack.findOneAndUpdate({_id: order_id, id_pay_id: id}, {track_id, payment_successful_date: date, is_done_successful: true}, {new: true, useFindAndModify: false, runValidators: true}, (err, updatedOrder) =>
                    {
                        if (err || !updatedOrder) res.redirect("https://www.kred.ir/payment/fail")
                        else
                        {
                            userVideoPackRelationController.addUserVideoPackPermission({video_pack_id: updatedOrder.video_pack_id, user_id: updatedOrder.user_id, buy_video_pack_id: updatedOrder._id})
                                .then(() =>
                                {
                                    res.redirect("https://www.kred.ir/payment/success")
                                    if (updatedOrder.off_code_id) offCodeController.useOffCode({user_id: updatedOrder.user_id, off_code_id: updatedOrder.off_code_id})

                                    for (let i = 0; i < data.adminIds.length; i++)
                                    {
                                        setTimeout(() =>
                                            {
                                                notificationController.sendNotification({
                                                    user_id: data.adminIds[i],
                                                    title: `ادمین! فروش داشتیم 🥳!`,
                                                    icon: data.domain_url + "/logo192.png",
                                                    url: data.domain_url + "/panel/sales",
                                                    body: updatedOrder.price.toString() + " تومان",
                                                    tag: updatedOrder._id.toString(),
                                                    requireInteraction: true,
                                                    renotify: true,
                                                })
                                            }
                                            , i * 1000)
                                    }

                                })
                                .catch(() => res.redirect("https://www.kred.ir/payment/fail"))
                        }
                    })
                }
                else
                {
                    console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica',consolas,sans-serif; font-weight:900;", response)
                    res.redirect("https://www.kred.ir/payment/fail")
                }
            })
            .catch((err) =>
            {
                console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica',consolas,sans-serif; font-weight:900;", err.response.data)
                res.redirect("https://www.kred.ir/payment/fail")
            })
    }
    else res.redirect("https://www.kred.ir/payment/fail")
}

const getBuyVideoPacks = ({condition}) =>
{
    return new Promise((resolve, reject) =>
    {
        buyVideoPack.find({...condition}, (err, buyVideoPacks) =>
        {
            if (err) reject({status: 500, err})
            else resolve({status: 200, buyVideoPacks})
        })
    })
}

const addBuyVideoForAdmin = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const {user_id, video_pack_id, price} = req.body
        if (user_id && video_pack_id && price)
        {
            const newBuyVideoPack = new buyVideoPack({is_done_successful: true, user_id, video_pack_id, price, created_by_admin: true})
            newBuyVideoPack.save((err, createdOrder) =>
            {
                if (err) res.status(500).send(err)
                else
                {
                    userVideoPackRelationController.addUserVideoPackPermission({video_pack_id, user_id, buy_video_pack_id: createdOrder._id})
                        .then(() => res.send({message: "done admin"}))
                        .catch((result) => res.status(result.status).send(result.err))
                }
            })
        }
        else res.status(400).send({message: "please send user_id, video_pack_id, price"})
    }
    else res.status(403).send({message: "don't have permission babe"})
}

const buyVideoPackController = {
    getLinkForPay,
    returnAfterPayment,
    getBuyVideoPacks,
    addBuyVideoForAdmin,
}

export default buyVideoPackController