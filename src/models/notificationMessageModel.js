import mongoose from "mongoose"
import data from "../data"

const schema = mongoose.Schema

const notificationMessageModel = new schema({
    sender_id: {
        type: schema.Types.ObjectId,
        required: "Enter sender_id!",
        ref: "user",
    },
    users_id: {
        type: [schema.Types.ObjectId],
    },
    title: {
        type: String,
        required: "Enter title!",
    },
    body: {
        type: String,
        required: "Enter body!",
    },
    icon: {
        type: String,
        default: "/media/pictures/logo192.png",
    },
    image: {
        type: String,
    },
    tag: {
        type: String,
        required: "Enter tag!",
    },
    url: {
        type: String,
        default: data.domain_url,
    },
    requireInteraction: {
        type: Boolean,
        default: true,
    },
    renotify: {
        type: Boolean,
        default: true,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default notificationMessageModel