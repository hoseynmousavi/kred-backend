import mongoose from "mongoose"
import offCodeModel from "../models/offCodeModel"
import userController from "./userController"

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
                if (takenCode.expire_date >= Date.now() && takenCode.usage < takenCode.max_usage && takenCode.users_who_use.filter(item => item.toString() === user_id.toString()).length < takenCode.max_usage_per_user)
                {
                    resolve({status: 200, code: takenCode})
                }
                else
                {
                    if (!(takenCode.users_who_use.filter(item => item.toString() === user_id.toString()).length < takenCode.max_usage_per_user))
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
    offCode.findOneAndUpdate({_id: off_code_id}, {$inc: {usage: 1}, $push: {users_who_use: user_id}}, {new: true, useFindAndModify: false, runValidators: true}, (err, updatedCode) =>
    {
        if (err || !updatedCode) console.log(err || "didn't find code")
    })
}

const getOffCodes = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        offCode.find(null, (err, offCodes) =>
        {
            res.send(offCodes.reverse())
        })
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const getOffCodeConsumers = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const {code_id} = req.params
        if (code_id)
        {
            offCode.findOne({_id: code_id}, (err, takenOffCode) =>
            {
                if (err) res.status(500).send(err)
                else if (!takenOffCode) res.status(404).send({message: "not found!"})
                else
                {
                    userController.getUsers({condition: {_id: {$in: takenOffCode.users_who_use}}})
                        .then(result => res.send(result.users))
                        .catch(result => res.status(result.status || 500).send(result.err))
                }
            })
        }
        else res.status(400).send({message: "send code_id!"})
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const addOffCode = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        delete req.body.users_who_use
        delete req.body.usage
        if (req.body.expire_date && !isNaN(req.body.expire_date)) req.body.expire_date = new Date().setDate(new Date().getDate() + parseInt(req.body.expire_date))
        else delete req.body.expire_date

        const newOffCode = new offCode(req.body)
        newOffCode.save((err, createdCode) =>
        {
            if (err) res.status(500).send(err)
            else res.send(createdCode)
        })
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const deleteOffCode = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        if (req.params.off_code_id)
        {
            offCode.findById(req.params.off_code_id, (err, takenOffCode) =>
            {
                if (err) res.status(500).send(err)
                else if (!takenOffCode) res.status(404).send({message: "didn't found!"})
                else
                {
                    if (takenOffCode.toJSON().usage === 0)
                    {
                        offCode.deleteOne({_id: req.params.off_code_id}, (err) =>
                        {
                            if (err) res.status(500).send(err)
                            else res.send({message: "deleted babe"})
                        })
                    }
                    else res.status(400).send({message: "کد وارد شده، سابقه مصرف شدن دارد!"})
                }
            })
        }
        else res.status(400).send({message: "send off_code_id as param"})
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const offCodeController = {
    validateCodeFunc,
    validateCode,
    addOffCode,
    useOffCode,
    getOffCodes,
    getOffCodeConsumers,
    deleteOffCode,
}

export default offCodeController