import webPush from "web-push"
import data from "../data"
import mongoose from "mongoose"
import notificationModel from "../models/notificationModel"
import notificationMessageModel from "../models/notificationMessageModel"
import saveFile from "../functions/saveFile"

const notification = mongoose.model("notification", notificationModel)
const notificationMessage = mongoose.model("notificationMessage", notificationMessageModel)

webPush.setGCMAPIKey(data.GCMKey)
webPush.setVapidDetails(
    "mailto:hoseyn.mousavi78@gmail.com",
    data.notifPublicKey,
    data.notifPrivateKey,
)

const notificationSubscribe = (req, res) =>
{
    const {token} = req.body
    const user_id = req.headers.authorization && req.headers.authorization._id
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
                        JSON.stringify({title, icon: icon || data.domain_url + "/logo192.png", body, image, tag, url, requireInteraction, renotify}),
                    )
                        .catch(err => console.log("notification", err))
                })
                resolve({status: 200})
            }
        })
    })
}

const sendNotificationForAdmins = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const sender_id = req.headers.authorization._id
        const {users_id, title, body, tag, url, requireInteraction, renotify} = req.body
        const icon = req.files ? req.files.icon : null
        const image = req.files ? req.files.image : null

        saveFile({file: icon, folder: "pictures"})
            .then(icon =>
            {
                saveFile({file: image, folder: "pictures"})
                    .then(image =>
                    {
                        const newNotificationMessage = new notificationMessage({sender_id, users_id, title, body, icon, image, tag, url, requireInteraction, renotify})
                        newNotificationMessage.save((err, created) =>
                        {
                            if (err) res.status(400).send(err)
                            else
                            {
                                const {users_id, title, body, icon, image, tag, url, requireInteraction, renotify} = created
                                notification.find(users_id ? {user_id: {$in: users_id}} : null, (err, tokens) =>
                                {
                                    if (err) res.status(400).send(err)
                                    else
                                    {
                                        tokens.forEach(notif =>
                                        {
                                            webPush.sendNotification(
                                                JSON.parse(notif.toJSON().token),
                                                JSON.stringify({title, icon: data.restful_url + icon, body, image: data.restful_url + image, tag, url, requireInteraction, renotify}),
                                            )
                                                .catch(err => console.log("notification err:", err))
                                        })
                                        res.send({message: "ok babe!"})
                                    }
                                })
                            }
                        })
                    })
                    .catch(err => res.status(500).send(err))
            })
            .catch(err => res.status(500).send(err))
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const notificationController = {
    notificationSubscribe,
    sendNotification,
    sendNotificationForAdmins,
}

export default notificationController