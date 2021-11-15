const nodemailer = require("nodemailer");

class Email {
    constructor() { }

    send(to_email, message) {
        return new Promise((resolve, reject) => {
            var smtpTransport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "emailmoduledemo@gmail.com",
                    pass: "wrjlpephrycezmbh",
                },
            });

            var from = "emailmoduledemo@gmail.com";
            var to = to_email;
            var subject = message;

            var generateTextFromHTML = true;
            var html = message

            const mailOptions = {
                from: from,
                to: to,
                subject: subject,
                generateTextFromHTML: generateTextFromHTML,
                html: html
            };

            smtpTransport.sendMail(mailOptions, (error, response) => {
                if (error) {
                    console.log(error)
                    reject(error)
                } else {
                    console.log(response);
                    resolve()
                }
            });
        })
    }
}

module.exports = new Email();