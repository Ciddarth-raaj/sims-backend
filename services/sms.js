const axios = require("axios");

const Vonage = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "895a7113",
  apiSecret: "GD08yjIw6bWk3CPQ"
})
class SMS {
  constructor() { }

  send(mobno, message) {
    return new Promise(async (resolve, reject) => {
      try {
        var to = mobno;
        var from = "Vonage APIs";
        var text = message;

        vonage.message.sendSms(from, to, text, (err, responseData) => {
          if (err) {
            reject(err)
          } else {
            if (responseData.messages[0]['status'] === "0") {
              console.log("Message sent successfully.");
              resolve();
            } else {
              console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
              reject(responseData.messages[0]['error-text'])
            }
          }
        })
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = new SMS();
