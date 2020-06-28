import tokenHelper from "./tokenHelper"

const addHeaderAndCheckPermissions = (app) =>
{
    app.use((req, res, next) =>
    {
        res.setHeader("Access-Control-Allow-Origin", "*")
        if (
            (req.originalUrl === "/") ||
            (req.originalUrl === "/user/" && req.method === "POST") ||
            (req.originalUrl === "/view/" && req.method === "POST") ||
            (req.originalUrl === "/code/") ||
            (req.originalUrl === "/user/forget-password/") ||
            (req.originalUrl === "/user/phone_check/") ||
            (req.originalUrl === "/user/email_check/") ||
            (req.originalUrl === "/user/username_check/") ||
            (req.originalUrl === "/user/login/") ||
            (req.originalUrl === "/datepicker") ||
            (req.originalUrl.slice(0, 8) === "/payment") ||
            (req.originalUrl.slice(0, 9) === "/exchange" && req.method === "GET") ||
            (req.originalUrl.slice(0, 9) === "/category" && req.method === "GET") ||
            (req.originalUrl.slice(0, 8) === "/company" && req.method === "GET") ||
            (req.originalUrl.slice(0, 13) === "/conversation" && req.method === "GET") ||
            (req.originalUrl.slice(0, 5) === "/city" && req.method === "GET") ||
            (req.originalUrl.slice(0, 16) === "/media/pictures/" && req.method === "GET") ||
            (req.originalUrl.slice(0, 6) === "/video" && req.method === "GET") ||
            (req.originalUrl.slice(0, 11) === "/subtitles/" && req.method === "GET") ||
            (req.originalUrl.slice(0, 7) === "/lesson" && req.method === "GET") ||
            (req.originalUrl.slice(0, 19) === "/education-resource" && req.method === "GET") ||
            (req.originalUrl.slice(0, 9) === "/site-map" && req.method === "GET") ||
            (req.originalUrl.slice(0, 6) === "/block" && req.method === "GET") ||
            (req.originalUrl.slice(0, 20) === "/view/users-diagram/" && req.method === "GET")
        )
        {
            if (req.headers.authorization)
            {
                tokenHelper.decodeToken(req.headers.authorization)
                    .then((payload) =>
                    {
                        req.headers.authorization = {...payload}
                        next()
                    })
                    .catch(() => next())
            }
            else next()
        }
        else
        {
            if (req.headers.authorization)
            {
                tokenHelper.decodeToken(req.headers.authorization)
                    .then((payload) =>
                    {
                        req.headers.authorization = {...payload}
                        next()
                    })
                    .catch((result) => res.status(result.status || 403).send(result.err))
            }
            else res.status(401).send({message: "send token!"})
        }
    })
}

export default addHeaderAndCheckPermissions
