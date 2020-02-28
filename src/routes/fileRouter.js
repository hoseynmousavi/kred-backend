import path from "path"
import videoController from "../controllers/videoController"
import videoPackCategoryController from "../controllers/videoPackCategoryController"
import videoPackController from "../controllers/videoPackController"

const fileRouter = (app, dirname) =>
{
    app.route("/media/:folder/:file").get((req, res) =>
    {
        res.setHeader("Cache-Control", "max-age=31536000")
        res.sendFile(path.join(dirname, `/media/${req.params.folder}/${req.params.file}`))
    })

    app.route("/videos/:file").get((req, res) =>
    {
        res.setHeader("Cache-Control", "max-age=31536000")
        if (/like Mac OS X/.test(req.headers["user-agent"])) res.setHeader("Content-Type", "video/mp4")
        res.sendFile(path.join(dirname, `/videos/${req.params.file}`))
    })

    app.route("/subtitles/:file").get((req, res) =>
    {
        if (req.headers.authorization)
        {
            if (req.headers.authorization.role === "admin") res.sendFile(path.join(dirname, `/subtitles/${req.params.file}`))
            else
            {
                const subtitleUrl = `/subtitles/${req.params.file}`
                videoController.getVideoBySubtitleUrl({subtitleUrl})
                    .then((resultVideo) =>
                    {
                        videoPackCategoryController.getVideoPackCategoryByVideo({videoPackCategoryId: resultVideo.video.video_pack_category_id})
                            .then((resultCategory) =>
                            {
                                videoPackController.getPermissionsFunc({condition: {user_id: req.headers.authorization._id, video_pack_id: resultCategory.videoPackCategory.video_pack_id}})
                                    .then((resultPermission) =>
                                    {
                                        if (resultPermission.relations && resultPermission.relations.length > 0) res.sendFile(path.join(dirname, `/subtitles/${req.params.file}`))
                                        else
                                        {
                                            if (resultVideo.video.is_free) res.status(202).sendFile(path.join(dirname, `/subtitles/${req.params.file}`))
                                            else res.status(403).send({message: "don't have permission"})
                                        }
                                    })
                                    .catch((result) => res.status(result.status || 500).send(result.err))
                            })
                            .catch((result) => res.status(result.status || 500).send(result.err))
                    })
                    .catch((result) => res.status(result.status || 500).send(result.err))
            }
        }
        else
        {
            const subtitleUrl = `/subtitles/${req.params.file}`
            videoController.getVideoBySubtitleUrl({subtitleUrl})
                .then((resultVideo) =>
                {
                    if (resultVideo.video.is_free) res.status(202).sendFile(path.join(dirname, `/subtitles/${req.params.file}`))
                    else res.status(401).send({message: "don't have permission"})
                })
        }
    })
}

export default fileRouter