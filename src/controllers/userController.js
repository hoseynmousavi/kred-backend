import mongoose from "mongoose"
import userModel from "../models/userModel"
import tokenHelper from "../functions/tokenHelper"
import verificationCodeController from "./verificationCodeController"
import axios from "axios"
import data from "../data"

const user = mongoose.model("user", userModel)

const getUsers = ({condition, projection, options}) =>
{
    return new Promise((resolve, reject) =>
    {
        user.find(condition, projection, options, (err, users) =>
        {
            if (err) reject({status: 500, err})
            else resolve({status: 200, users})
        })
    })
}

const getUsersCount = ({condition}) =>
{
    return new Promise((resolve, reject) =>
    {
        user.countDocuments(condition, (err, users) =>
        {
            if (err) reject({status: 500, err})
            else resolve({status: 200, users})
        })
    })
}

const phoneCheck = (req, res) =>
{
    const {phone} = req.body
    if (phone.trim().length === 11)
        user.find({phone}, {phone: 1}, (err, users) =>
        {
            if (err) res.status(500).send(err)
            else if (users) res.send({count: users.length})
            else res.send({count: 0})
        })
    else res.status(400).send({message: "please don't send shit."})
}

const addNewUser = (req, res) =>
{
    delete req.body.created_date
    delete req.body.role
    delete req.body.email_verified
    delete req.body.phone_verified
    verificationCodeController.verifyCode({phone: req.body.phone, code: req.body.code})
        .then(() =>
        {
            const newUser = new user(req.body)
            newUser.save((err, createdUser) =>
            {
                if (err) res.status(400).send(err)
                else
                {
                    const user = createdUser.toJSON()
                    tokenHelper.encodeToken({_id: user._id, password: user.password})
                        .then((token) =>
                        {
                            delete user.password
                            res.send({...user, token})
                        })
                        .catch((err) => res.status(500).send({message: err}))
                }
            })
        })
        .catch(err => res.status(err.status || 500).send({message: err.err}))
}

const userLogin = (req, res) =>
{
    const phone = req.body.phone
    const password = req.body.password

    user.findOne({$or: [{phone}, {email: phone}], password}, (err, takenUser) =>
    {
        if (err) res.status(400).send(err)
        else if (!takenUser) res.status(404).send({message: "user not found!"})
        else
        {
            const user = takenUser.toJSON()
            tokenHelper.encodeToken({_id: user._id, password: user.password})
                .then((token) =>
                {
                    delete user.password
                    res.send({...user, token})
                })
                .catch((err) => res.status(500).send({message: err}))
        }
    })
}

const verifyToken = ({_id, password}) =>
{
    return new Promise((resolve, reject) =>
    {
        if (_id && password)
        {
            user.findOne({_id, password}, (err, takenUser) =>
            {
                if (err) reject({status: 500, err})
                else if (!takenUser) reject({status: 403, err: {message: "token is not valid!"}})
                else resolve({status: 200, err: {message: "it's valid babe!"}, user: takenUser.toJSON()})
            })
        }
        else reject({status: 403, err: {message: "token is not valid!"}})
    })
}

const verifyTokenRoute = (req, res) =>
{
    const {_id} = req.headers.authorization
    user.findById(_id, (err, takenUser) =>
    {
        if (err) res.status(500).send(err)
        else
        {
            const user = takenUser.toJSON()
            delete user.password
            res.send({...user})
        }
    })
}

const updateUserById = (req, res) =>
{
    delete req.body.created_date
    delete req.body.role
    delete req.body.email_verified
    delete req.body.phone_verified
    delete req.body.phone

    user.findOneAndUpdate({_id: req.headers.authorization._id}, req.body, {new: true, useFindAndModify: false, runValidators: true}, (err, updatedUser) =>
    {
        if (err) res.status(400).send(err)
        else
        {
            if (req.body.password)
            {
                const user = updatedUser.toJSON()
                tokenHelper.encodeToken({_id: user._id, password: user.password})
                    .then((token) =>
                    {
                        delete user.password
                        res.send({...user, token})
                    })
                    .catch((err) => res.status(500).send({message: err}))
            }
            else res.send(updatedUser)
        }
    })
}

const sendForgottenPassword = (req, res) =>
{
    const {phone} = req.body
    if (phone && phone.length === 11 && !isNaN(phone))
    {
        userExist({phone})
            .then(result =>
            {
                const {user} = result
                axios.get(encodeURI(`https://api.kavenegar.com/v1/${data.kavenegarKey}/verify/lookup.json?receptor=${phone}&token=${user.name ? user.name.split(" ")[0] : "کاربر"}&token2=${user.password}&template=forget-password`))
                    .then((response) =>
                    {
                        if (response.data.return.status === 200) res.send({message: "ok"})
                        else res.status(500).send({message: "kavenegar err!"})
                    })
                    .catch(() => res.status(500).send({message: "kavenegar err!"}))
            })
            .catch(result => res.status(result.status || 500).send(result.err))
    }
    else res.status(400).send({message: "send an ok phone!"})
}

const userExist = ({phone}) =>
{
    return new Promise((resolve, reject) =>
    {
        user.findOne({phone}, (err, takenUser) =>
        {
            if (err) reject({status: 500, err})
            else if (!takenUser) reject({status: 404, err: {message: "user not found!"}})
            else resolve({status: 200, user: takenUser.toJSON()})
        })
    })
}

const userController = {
    addNewUser,
    userLogin,
    updateUserById,
    phoneCheck,
    getUsers,
    verifyToken,
    verifyTokenRoute,
    sendForgottenPassword,
    getUsersCount,
    userExist,
}

export default userController