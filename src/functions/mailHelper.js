import nodeMailer from "nodemailer"

const sendMail = ({receivers, subject, text, html}) =>
{
    const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: "health.in.touch.co@gmail.com",
            pass: "ezha7778",
        },
    })

    transporter.sendMail({
        from: "Kred Info", // sender address
        to: receivers, // list of receivers | string split by comma
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    })
        .then(info => console.log("Message sent: %s", info.messageId))
        .catch(() => console.log("email err"))
}

const mailHelper = {
    sendMail,
}

export default mailHelper