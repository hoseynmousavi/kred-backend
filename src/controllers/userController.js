import mongoose from "mongoose"
import userModel from "../models/userModel"
import tokenHelper from "../functions/tokenHelper"
import verificationCodeController from "./verificationCodeController"
import axios from "axios"
import data from "../data"
import blackListModel from "../models/blackListModel"

const user = mongoose.model("user", userModel)
const blackList = mongoose.model("blackList", blackListModel)

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

const usernameCheck = (req, res) =>
{
    const username = req.body.username.toLowerCase().trim()
    if (username.length > 2 && username.length < 41)
        user.find({username}, {username: 1}, (err, users) =>
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
    const {phone, code, error, username} = req.body
    if (phone && username)
    {
        if (code)
        {
            verificationCodeController.verifyCode({phone, code})
                .then(() =>
                {
                    const newUser = new user({...req.body, username: req.body.username.toLowerCase().trim()})
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
                                .catch(err => res.status(500).send({message: err}))
                        }
                    })
                })
                .catch(err => res.status(err.status || 500).send({message: err.err}))
        }
        else if (error)
        {
            const newUser = new user({...req.body, username: req.body.username.toLowerCase().trim(), phone_verified: false})
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
        }
    }
    else res.status(400).send({message: "send phone && username at least!"})
}

const userLogin = (req, res) =>
{
    const phone = req.body.phone
    const password = req.body.password

    user.findOne({$or: [{phone}, {email: phone}, {username: req.body.phone.toLowerCase().trim()}], password}, (err, takenUser) =>
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

const verifyTokenRoute = (req, res) => res.send({...req.headers.authorization})

const updateUserById = (req, res) =>
{
    delete req.body.created_date
    delete req.body.role
    delete req.body.email_verified
    delete req.body.phone_verified
    delete req.body.phone

    const avatar = req.files ? req.files.avatar : null
    if (avatar)
    {
        const avatarName = new Date().toISOString() + avatar.name
        avatar.mv(`media/pictures/${avatarName}`, (err) =>
        {
            if (err) console.log(err)
            user.findOneAndUpdate({_id: req.headers.authorization._id}, {...req.body, avatar: `/media/pictures/${avatarName}`}, {new: true, useFindAndModify: false, runValidators: true}, (err, updatedUser) =>
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
                    else
                    {
                        const user = updatedUser.toJSON()
                        delete user.password
                        res.send({...user})
                    }
                }
            })
        })
    }
    else
    {
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
                else
                {
                    const user = updatedUser.toJSON()
                    delete user.password
                    res.send({...user})
                }
            }
        })
    }
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

const isNotBlocked = ({phone}) =>
{
    return new Promise((resolve, reject) =>
    {
        blackList.findOne({phone}, (err, takenUser) =>
        {
            if (err) reject({status: 500, err})
            else if (!takenUser) resolve()
            else reject({status: 403, err: {message: "user found!"}})
        })
    })
}

const addBlockedUser = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const {phone} = req.body
        new blackList({phone}).save((err, created) =>
        {
            if (err) res.status(400).send(err)
            else res.send(created)
        })
    }
    else res.status(400).send({message: "you are not admin babe! try harder :)))"})
}

const userController = {
    addNewUser,
    userLogin,
    updateUserById,
    phoneCheck,
    usernameCheck,
    getUsers,
    verifyToken,
    verifyTokenRoute,
    sendForgottenPassword,
    getUsersCount,
    userExist,
    isNotBlocked,
    addBlockedUser,
}

export default userController