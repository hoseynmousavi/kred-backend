import jwt from 'jsonwebtoken'
import data from '../data'

const encodeToken = (payload) =>
{
    return new Promise((resolve, reject) =>
        jwt.sign(payload, data.sign, {algorithm: 'HS512'}, (err, token) =>
        {
            if (err) reject(err)
            else resolve(token)
        }),
    )
}

const decodeToken = (token) =>
{
    return new Promise((resolve, reject) =>
        jwt.verify(token, data.sign, {algorithm: 'HS512'}, (err, payload) =>
        {
            if (err) reject(err)
            else resolve(payload)
        }),
    )
}

const tokenHelper = {
    encodeToken,
    decodeToken,
}

export default tokenHelper
