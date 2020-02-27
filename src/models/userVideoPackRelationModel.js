import mongoose from "mongoose"

const schema = mongoose.Schema

const userPackRelationModel = new schema({
    user_id: {
        type: schema.Types.ObjectId,
        ref: "user",
        required: "Enter user_id!",
    },
    video_pack_id: {
        type: schema.Types.ObjectId,
        ref: "videoPack",
        required: "Enter video_pack_id!",
    },
    buy_video_pack_id: {
        type: schema.Types.ObjectId,
        ref: "buyVideoPack",
        required: "Enter buy_video_pack_id!",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

userPackRelationModel.index({user_id: 1, video_pack_id: 1}, {unique: true})

export default userPackRelationModel