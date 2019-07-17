import mongoose from 'mongoose'
import userModel from '../models/userModel'

const user = mongoose.model('user', userModel)

const getUsers = (req, res) =>
{
    user.find({}, (err, users) =>
    {
        if (err) res.send(err)
        else res.send(users)
    })
}

const addNewUser = (req, res) =>
{
    let newUser = new user(req.body)
    newUser.save((err, createdUser) =>
    {
        if (err) res.send(err)
        else res.send(createdUser)
    })
}

const getUserById = (req, res) =>
{
    user.findById(req.params.userId, (err, takenUser) =>
    {
        if (err) res.send(err)
        else res.send(takenUser)
    })
}

const updateUserById = (req, res) =>
{
    // {new: true} means return new data after update
    user.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true, useFindAndModify: false}, (err, updatedUser) =>
    {
        if (err) res.send(err)
        else res.send(updatedUser)
    })
}

const deleteUserById = (req, res) =>
{
    user.deleteOne({_id: req.params.userId}, (err) =>
    {
        if (err) res.send(err)
        else res.send({state: 1, message: 'user deleted successfully.'})
    })
}


const userController = {
    getUsers,
    addNewUser,
    getUserById,
    updateUserById,
    deleteUserById,
}

export default userController