import mongoose from "mongoose"
import userModel from "../models/userModel"
import tokenHelper from "../functions/tokenHelper"

const user = mongoose.model("user", userModel)

// const getUsers = (req, res) =>
// {
//     user.find({}, {email: 1, email_verified: 1, name: 1, major: 1, birth_date: 1, university: 1, avatar: 1, created_date: 1}, (err, users) =>
//     {
//         if (err) res.status(400).send(err)
//         else res.send(users)
//     })
// }

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
    const newUser = new user(req.body)
    newUser.save((err, createdUser) =>
    {
        if (err) res.status(400).send(err)
        else
        {
            const user = createdUser.toJSON()
            tokenHelper.encodeToken(user)
                .then((token) => res.send({...user, token}))
                .catch((err) => res.status(500).send({message: err}))
        }
    })
}

const getUserById = (req, res) =>
{
    user.findById(req.params.userId, (err, takenUser) =>
    {
        if (err) res.status(500).send(err)
        else res.send(takenUser)
    })
}

const userLogin = (req, res) =>
{
    const phone = req.body.phone
    const password = req.body.password

    user.findOne({phone, password}, (err, takenUser) =>
    {
        if (err) res.status(400).send(err)
        else if (!takenUser)
        {
            user.findOne({email: phone, password}, (err, takenUser) =>
            {
                if (err) res.status(400).send(err)
                else if (!takenUser) res.status(404).send({message: "user not found!"})
                else
                {
                    const user = takenUser.toJSON()
                    tokenHelper.encodeToken(user)
                        .then((token) => res.send({...user, token}))
                        .catch((err) => res.status(500).send({message: err}))
                }
            })
        }
        else
        {
            const user = takenUser.toJSON()
            tokenHelper.encodeToken(user)
                .then((token) => res.send({...user, token}))
                .catch((err) => res.status(500).send({message: err}))
        }
    })
}

const updateUserById = (req, res) =>
{
    // TODO Hoseyn check token role then let them update even these things
    delete req.body.created_date
    delete req.body.role
    delete req.body.email_verified
    user.findOneAndUpdate({_id: req.headers.authorization._id}, req.body, {new: true, useFindAndModify: false, runValidators: true}, (err, updatedUser) =>
    {
        if (err) res.status(400).send(err)
        else res.send(updatedUser)
    })
}

const userController = {
    // getUsers,
    addNewUser,
    getUserById,
    userLogin,
    updateUserById,
    phoneCheck,
}

export default userController