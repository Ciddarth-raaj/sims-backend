const axios = require("axios");

const sender = "SIMSVD";
const template_id = "6";
const access_token = "8a9704b16e04d8d4a278dcd6e1e04d8d";
class SMS {
  constructor() {}

  send(mobno, message) {
    return new Promise(async (resolve, reject) => {
      try {
        const url = `https://txt.smsbajar.com/api/v2/sms/send?template_id=${template_id}&message=${message}&sender=${sender}&to=${mobno}&service=T&access_token=${access_token}`;
        const res = await axios.get(url);
        if (res.status != 200) {
          reject();
          return;
        }
        console.log(res.data);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = new SMS();
