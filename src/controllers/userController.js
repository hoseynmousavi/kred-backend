import mongoose from "mongoose"
import userModel from "../models/userModel"
import tokenHelper from "../functions/tokenHelper"
import verificationCodeController from "./verificationCodeController"

const user = mongoose.model("user", userModel)

const getUsers = ({condition}) =>
{
    return new Promise((resolve, reject) =>
    {
        user.find({...condition}, (err, users) =>
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

const userController = {
    addNewUser,
    userLogin,
    updateUserById,
    phoneCheck,
    getUsers,
    verifyToken,
    verifyTokenRoute,
}

export default userController