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
        var to = "91" + mobno;
        var from = "Vonage APIs";
        var text = message;

        vonage.message.sendSms(from, to, text, (err, responseData) => {
          if (err) {
            reject(err)
          } else {
            if (responseData.messages[0]['status'] === "0") {
              resolve();
            } else {
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
