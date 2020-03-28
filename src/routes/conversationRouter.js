import conversationController from "../controllers/conversationController"

const conversationRouter = (app) =>
{
    app.route("/conversation")
        .get(conversationController.getConversations)
        .post(conversationController.addNewConversation)
        .patch(conversationController.updateConversation)

    app.route("/conversation/:conversationId")
        .get(conversationController.getConversationById)

    app.route("/conversation/like")
        .post(conversationController.addNewLike)

    app.route("/conversation/like/:conversationId")
        .delete(conversationController.deleteLike)

    app.route("/conversation/comment/like")
        .post(conversationController.addNewCommentLike)

    app.route("/conversation/comment/like/:commentId")
        .delete(conversationController.deleteCommentLike)

    app.route("/conversation/comment")
        .post(conversationController.addNewComment)

    app.route("/conversation/comments/:conversationId")
        .get(conversationController.getConversationComments)

    app.route("/conversation/comment/:commentId")
        .delete(conversationController.deleteComment)
}

export default conversationRouter