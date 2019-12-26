import mongoose from "mongoose"
import packPermissionModel from "../models/packPermissionModel"

const packPermission = mongoose.model("pack", packPermissionModel)

const checkPermission = (phone, reject, resolve) => {
    packPermission.find({phone}, null, null, (err, permissions) => {
        if (err) reject(400)
        else {
            if (permissions && permissions.length > 0) resolve()
            else reject(401)
        }
    })
}

const packPermissionController = {
    checkPermission,
}

export default packPermissionController