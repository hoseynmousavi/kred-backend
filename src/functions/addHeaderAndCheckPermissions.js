import tokenHelper from "./tokenHelper"

const addHeaderAndCheckPermissions = (app) =>
{
    app.use((req, res, next) =>
    {
        res.setHeader("Access-Control-Allow-Origin", "*")
        if (
            (req.originalUrl === "/") ||
            (req.originalUrl === "/user" && req.method === "POST") ||
            (req.originalUrl === "/user/login") ||
            (req.originalUrl === "/datepicker")
        )
        {
            next()
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
                    .catch((err) => res.status(401).send(err))
            }
            else res.status(401).send({message: "send token!"})
        }
    })
}

export default addHeaderAndCheckPermissions
