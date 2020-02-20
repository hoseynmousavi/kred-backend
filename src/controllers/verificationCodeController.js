import mongoose from "mongoose"
import axios from "axios"
import verificationCodeModel from "../models/verificationCodeModel"

const verificationCode = mongoose.model("verificationCode", verificationCodeModel)
const apiKey = "39572B7445383449645A59492B52307965764C56443956674F4F647736527561526534527770446C30554D3D"

const sendVerificationCode = (req, res) =>
{
    const {phone} = req.body
    if (phone && phone.length === 11 && !isNaN(phone))
    {
        verificationCode.findOne({phone}, (err, takenCode) =>
        {
            if (err) res.status(500).send(err)
            else if (takenCode) res.send({message: "ok"})
            else
            {
                const code = Math.floor(Math.random() * 8999) + 1000
                axios.get(`https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json?receptor=${phone}&token=${code}&template=phone-verify`)
                    .then((response) =>
                    {
                        if (response.data.return.status === 200)
                        {
                            const newVerificationCode = new verificationCode({phone, code})
                            newVerificationCode.save((err, _) =>
                            {
                                if (err) res.status(500).send(err)
                                else res.send({message: "ok"})
                            })
                        }
                        else res.status(500).send({message: "kavenegar err!"})
                    })
                    .catch(() => res.status(500).send({message: "kavenegar err!"}))
            }
        })
    }
    else res.status(400).send({message: "send an ok phone!"})
}

const verifyCode = ({phone, code}) =>
{
    return new Promise((resolve, reject) =>
    {
        if (phone && phone.length === 11 && !isNaN(phone) && code && code.length === 4 && !isNaN(code))
        {
            verificationCode.findOne({phone, code}, (err, takenCode) =>
            {
                if (err) reject({status: 500, err})
                else if (takenCode)
                {
                    resolve({status: 200})
                    verificationCode.deleteOne({phone, code}, (err) => console.log(err ? err : "deleted code successfully."))
                }
                else reject({status: 404, err: "code verification failed!"})
            })
        }
        else reject({status: 400, err: "send ok phone and code!"})
    })
}

const verificationCodeController = {
    sendVerificationCode,
    verifyCode,
}

export default verificationCodeController