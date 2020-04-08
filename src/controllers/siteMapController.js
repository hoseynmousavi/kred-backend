import videoPackController from "./videoPackController"
import exchangeController from "./exchangeController"
import conversationController from "./conversationController"
import classController from "./classController"

const getSiteMap = (req, res) =>
{
    const staticUrls =
        "https://www.kred.ir\n" +
        "https://www.kred.ir/videos\n" +
        // "https://www.kred.ir/class\n" + // remove
        "https://www.kred.ir/pavilions\n" +
        "https://www.kred.ir/exchanges\n" +
        "https://www.kred.ir/sign-up\n"

    videoPackController.getVideoPackDistinct()
        .then(videos =>
        {
            exchangeController.getExchangesDistinct()
                .then(exchanges =>
                {
                    conversationController.getConversationDistinct()
                        .then(conversations =>
                        {
                            classController.getLessonSiteMap()
                                .then(lessonSiteMap =>
                                {
                                    classController.getBlockSiteMap()
                                        .then(blockSiteMap =>
                                        {
                                            res.send(
                                                staticUrls +
                                                videos.reduce((sum, video) => `${sum}https://www.kred.ir/videos/${video}\n`, "") +
                                                // lessonSiteMap +
                                                // blockSiteMap +
                                                conversations.reduce((sum, conversation) => `${sum}https://www.kred.ir/pavilions/${conversation}\n`, "") +
                                                exchanges.reduce((sum, exchange) => `${sum}https://www.kred.ir/exchanges/${exchange}\n`, ""),
                                            )
                                        })
                                        .catch(err => res.status(500).send(err.err))
                                })
                                .catch(err => res.status(500).send(err.err))
                        })
                        .catch(err => res.status(500).send(err))
                })
                .catch(err => res.status(500).send(err))
        })
        .catch(err => res.status(500).send(err))
}

const siteMapController = {
    getSiteMap,
}

export default siteMapController