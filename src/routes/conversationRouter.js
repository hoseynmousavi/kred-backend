import conversationController from "../controllers/conversationController"

const conversationRouter = (app) =>
{
    app.route("/conversation")
        .get(conversationController.getConversations)
        .post(conversationController.addNewConversation)
        .patch(conversationController.updateConversation)

    app.route("/conversation/:conversation_id")
        .get(conversationController.getConversationById)

    app.route("/conversation/like")
        .post(conversationController.addNewLike)

    app.route("/conversation/like/:conversation_id")
        .delete(conversationController.deleteLike)

    app.route("/conversation/comment/like")
        .post(conversationController.addNewCommentLike)

    app.route("/conversation/comment/like/:comment_id")
        .delete(conversationController.deleteCommentLike)

    app.route("/conversation/comment")
        .post(conversationController.addNewComment)

    app.route("/conversation/comments/:conversation_id")
        .get(conversationController.getConversationComments)

    app.route("/conversation/comment/:comment_id")
        .delete(conversationController.deleteComment)
}

export default conversationRouter