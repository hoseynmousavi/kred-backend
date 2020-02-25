import mailHelper from "../functions/mailHelper"

const sendMail = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const {subject, text, receivers} = req.body
        if (subject && text && receivers)
        {
            mailHelper.sendMail({subject, text, receivers})
            res.send({message: "I will try babe!"})
        }
        else res.status(400).send({message: "send subject, text, receivers please!"})
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const mailController = {
    sendMail,
}

export default mailController