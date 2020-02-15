import mongoose from "mongoose"

const schema = mongoose.Schema

const userPackRelationModel = new schema({
    user_id: {
        type: schema.Types.ObjectId,
        ref: "user",
    },
    video_pack_id: {
        type: schema.Types.ObjectId,
        ref: "videoPack",
    },
})

export default userPackRelationModel