import mongoose from "mongoose"
import conversationModel from "../models/conversationModel"
import conversationLikeModel from "../models/conversationLikeModel"
import conversationCommentModel from "../models/conversationCommentModel"

const conversation = mongoose.model("conversation", conversationModel)
const like = mongoose.model("conversationLike", conversationLikeModel)
const comment = mongoose.model("conversationComment", conversationCommentModel)

const getConversations = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 9
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    conversation.find(null, null, {sort: "-created_date", skip, limit}, (err, conversations) =>
    {
        if (err) res.status(500).send(err)
        else res.send(conversations)
    })
}

const getConversationById = (req, res) =>
{
    conversation.findById(req.params.conversationId, (err, takenConversation) =>
    {
        if (err) res.status(500).send(err)
        else if (!takenConversation) res.status(404).send({message: "not found!"})
        else res.send(takenConversation)
    })
}

const addNewConversation = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const picture = req.files ? req.files.picture : null
        if (picture)
        {
            const picName = new Date().toISOString() + picture.name
            picture.mv(`media/pictures/${picName}`, (err) =>
            {
                if (err)
                {
                    console.log(err)
                    res.status(500).send({message: "internal save picture error!"})
                    return false
                }
                else
                {
                    delete req.body.created_date
                    delete req.body.likes_count
                    delete req.body.comments_count
                    const newConversation = new conversation({...req.body, picture: `media/pictures/${picName}`})
                    newConversation.save((err, createdConversation) =>
                    {
                        if (err)
                        {
                            console.log(err)
                            res.status(400).send(err)
                        }
                        else res.send(createdConversation)
                    })
                }
            })
        }
        else res.status(400).send({message: "send picture!"})
    }
    else res.status(400).send({message: "you are not admin babe! try harder :)))"})
}

const addNewLike = (req, res) =>
{
    delete req.body.created_date
    req.body.user_id = req.headers.authorization._id
    const newLike = new like(req.body)
    newLike.save((err, createdLike) =>
    {
        if (err) res.status(400).send(err)
        else
        {
            conversation.findOneAndUpdate(
                {_id: req.body.conversation_id},
                {$inc: {likes_count: 1}},
                {useFindAndModify: false},
                (err) =>
                {
                    if (err)
                    {
                        console.log(err)
                        res.status(500).send(err)
                    }
                    else res.send(createdLike)
                },
            )
        }
    })
}

const deleteLike = (req, res) =>
{
    like.deleteOne({conversation_id: req.params.conversationId, user_id: req.headers.authorization._id}, (err, statistic) =>
    {
        if (err) res.status(400).send(err)
        else if (statistic.deletedCount === 1)
        {
            conversation.findOneAndUpdate(
                {_id: req.params.conversationId},
                {$inc: {likes_count: -1}},
                {useFindAndModify: false},
                (err) =>
                {
                    if (err)
                    {
                        console.log(err)
                        res.status(500).send(err)
                    }
                    else res.send({message: "like deleted successfully"})
                },
            )
        }
        else res.status(404).send({message: "like not found!"})
    })
}

const addNewComment = (req, res) =>
{
    delete req.body.created_date
    req.body.user_id = req.headers.authorization._id
    const newComment = new comment(req.body)
    newComment.save((err, createdComment) =>
    {
        if (err) res.status(400).send(err)
        else
        {
            conversation.findOneAndUpdate(
                {_id: req.body.conversation_id},
                {$inc: {comments_count: 1}},
                {useFindAndModify: false},
                (err) =>
                {
                    if (err)
                    {
                        console.log(err)
                        res.status(500).send(err)
                    }
                    else res.send(createdComment)
                },
            )
        }
    })
}

const getConversationComments = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 9
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    comment.find({is_deleted: false, conversation_id: req.params.conversationId}, null, {sort: "-created_date", skip, limit}, (err, comments) =>
    {
        if (err) res.status(400).send(err)
        else res.send(comments)
    })
}


const updateCommentById = (req, res) =>
{
    comment.findOneAndUpdate(
        {_id: req.body.comment_id, user_id: req.headers.authorization._id, is_deleted: false},
        {description: req.body.description},
        {new: true, useFindAndModify: false, runValidators: true},
        (err, updatedComment) =>
        {
            if (err)
            {
                console.log(err)
                res.status(400).send(err)
            }
            else res.send(updatedComment)
        },
    )
}

const deleteComment = (req, res) =>
{
    comment.findOne({_id: req.params.commentId, user_id: req.headers.authorization._id, is_deleted: false}, (err, takenComment) =>
    {
        if (err) res.status(400).send(err)
        else if (!takenComment) res.status(404).send({message: "comment not found!"})
        else
        {
            comment.findOneAndUpdate(
                {_id: req.params.commentId, user_id: req.headers.authorization._id},
                {is_deleted: true},
                {useFindAndModify: false},
                (err) =>
                {
                    if (err) res.status(400).send(err)
                    else
                    {
                        conversation.findOneAndUpdate(
                            {_id: takenComment.conversation_id},
                            {$inc: {comments_count: -1}},
                            {useFindAndModify: false},
                            (err) =>
                            {
                                if (err) res.status(400).send(err)
                                else res.send({message: "comment deleted successfully"})
                            },
                        )
                    }
                },
            )
        }
    })
}

const conversationController = {
    getConversations,
    getConversationById,
    addNewConversation,
    addNewLike,
    deleteLike,
    addNewComment,
    updateCommentById,
    deleteComment,
    getConversationComments,
}

export default conversationController