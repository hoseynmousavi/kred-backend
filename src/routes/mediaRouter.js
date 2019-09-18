const mediaRouter = (app) =>
{
    app.route("/media/:file").get((req, res) =>
    {
        res.setHeader("Cache-Control", "max-age=31536000")
        res.sendFile(path.join(__dirname, `/media/${req.params.file}`))
    })
}

export default mediaRouter