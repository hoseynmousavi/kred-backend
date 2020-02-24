import mongoose from "mongoose"
import offCodeModel from "../models/offCodeModel"

const offCode = mongoose.model("offCode", offCodeModel)

const validateCodeFunc = ({code, user_id}) =>
{
    return new Promise((resolve, reject) =>
    {
        offCode.findOne({code}, null, null, (err, takenCode) =>
        {
            if (err) reject({status: 500, err})
            else if (!takenCode) reject({status: 404, err: {message: "کدی با این متن یافت نشد!"}})
            else
            {
                if (takenCode.expire_date >= Date.now() && takenCode.usage < takenCode.max_usage && takenCode.users_who_user.indexOf(user_id) === -1)
                {
                    resolve({status: 200, code: takenCode})
                }
                else
                {
                    if (!(takenCode.users_who_user.indexOf(user_id) === -1))
                    {
                        reject({status: 400, err: {message: "کد تخفیف قبلا توسط شما استفاده شده است!"}})
                    }
                    else if (!(takenCode.usage < takenCode.max_usage))
                    {
                        reject({status: 400, err: {message: "کد به تعداد حداکثری مصرف شده است!"}})
                    }
                    else if (!(takenCode.expire_date >= Date.now()))
                    {
                        reject({status: 400, err: {message: "کد تخفیف منقضی شده است!"}})
                    }
                }
            }
        })
    })
}

const validateCode = (req, res) =>
{
    const user_id = req.headers.authorization._id
    const {code} = req.body
    if (code && user_id)
    {
        validateCodeFunc({code, user_id})
            .then((result) => res.send({message: "ok", code: result.code}))
            .catch((result) => res.status(result.status || 500).send(result.err))
    }
    else res.status(400).send({message: "send token & code!"})
}

const useOffCode = ({off_code_id, user_id}) =>
{
    offCode.findOneAndUpdate({_id: off_code_id}, {$inc: {usage: 1}, $push: {users_who_user: user_id}}, {new: true, useFindAndModify: false, runValidators: true}, (err, updatedCode) =>
    {
        if (err || !updatedCode) console.log(err || "didn't find code")
    })
}

const addOffCode = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        delete req.body.users_who_user
        delete req.body.usage
        if (req.body.expire_date && !isNaN(req.body.expire_date)) req.body.expire_date = new Date().setDate(new Date().getDate() + parseInt(req.body.expire_date))
        else delete req.body.expire_date

        const newOffCode = new offCode(req.body)
        newOffCode.save((err, createdCode) =>
        {
            if (err) res.status(500).send(err)
            else
            {
                res.send(createdCode)
            }
        })
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const offCodeController = {
    validateCodeFunc,
    validateCode,
    addOffCode,
    useOffCode,
}

export default offCodeController