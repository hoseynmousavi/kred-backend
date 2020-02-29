import jwt from "jsonwebtoken"
import data from "../data"
import userController from "../controllers/userController"

const encodeToken = (payload) =>
{
    return new Promise((resolve, reject) =>
        jwt.sign(payload, data.sign, {algorithm: "HS512"}, (err, token) =>
        {
            if (err) reject(err)
            else resolve(token)
        }),
    )
}

const decodeToken = (token) =>
{
    return new Promise((resolve, reject) =>
        jwt.verify(token, data.sign, {algorithm: "HS512"}, (err, payload) =>
        {
            if (err) reject({status: 403, err})
            else
            {
                const {password, _id} = payload
                userController.verifyToken({password, _id})
                    .then((result) => resolve(result.user))
                    .catch((result) => reject({status: result.status, err: result.err}))
            }
        }),
    )
}

const tokenHelper = {
    encodeToken,
    decodeToken,
}

export default tokenHelper
