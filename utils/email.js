const nodemailer =require('nodemailer')

const sendEmail = async option => {
    // 1)create transporter mean define the service like Gmail serivce
    const transporter = nodemailer.createTransport({
        host: process.env.HOST_EMAIL,
        port: process.env.PORT_EMAIL,
        auth:{
            user: process.env.USER_EMAIL,
            pass: process.env.PASS_EMAIL,
        }
    })
    // 2) define email options
    const mailoption = {
        from: "osama<demo@gmail.com>",
        to: option.email,
        subject: option.subject,
        text: option.message
    }
    
    // 3) send email
    await transporter.sendMail(mailoption)
}

module.exports = sendEmail