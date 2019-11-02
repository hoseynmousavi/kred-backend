import conversationController from "../controllers/conversationController"

const conversationRouter = (app) =>
{
    app.route("/conversation")
        .get(conversationController.getConversations)
        .post(conversationController.addNewConversation)

    app.route("/conversation/like")
        .post(conversationController.addNewLike)

    app.route("/conversation/like/:conversationId")
        .delete(conversationController.deleteLike)

    app.route("/conversation/comment")
        .post(conversationController.addNewComment)
        .patch(conversationController.updateCommentById)

    app.route("/conversation/comments/:conversationId")
        .get(conversationController.getConversationComments)

    app.route("/conversation/comment/:commentId")
        .delete(conversationController.deleteComment)

    app.route("/conversation/:conversationId")
        .get(conversationController.getConversationById)
}

export default conversationRouter