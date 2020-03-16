import webPush from "web-push"
import data from "../data"
import mongoose from "mongoose"
import notificationModel from "../models/notificationModel"

const notification = mongoose.model("notification", notificationModel)

webPush.setGCMAPIKey(data.GCMKey)
webPush.setVapidDetails(
    "mailto:hoseyn.mousavi78@gmail.com",
    data.notifPublicKey,
    data.notifPrivateKey,
)

const notificationSubscribe = (req, res) =>
{
    const {token} = req.body
    const user_id = req.headers.authorization._id
    if (user_id && token)
    {
        const newNotification = new notification({user_id, token: JSON.stringify(token)})
        newNotification.save((err, _) =>
        {
            if (err) res.status(500).send(err)
            else res.sendStatus(200)
        })
    }
    else res.status(400).send({message: "send token and token!"})
}

const sendNotification = ({user_id, title, icon, body, image, tag, url, requireInteraction, renotify}) =>
{
    return new Promise((resolve, reject) =>
    {
        notification.find({user_id}, (err, tokens) =>
        {
            if (err) reject({status: 500, err})
            else
            {
                tokens.forEach(notif =>
                {
                    webPush.sendNotification(
                        JSON.parse(notif.toJSON().token),
                        JSON.stringify({title, icon, body, image, tag, url, requireInteraction, renotify}),
                    )
                        .catch(err => console.log("notification", err))
                })
                resolve({status: 200})
            }
        })
    })
}

const notificationController = {
    notificationSubscribe,
    sendNotification,
}

export default notificationController