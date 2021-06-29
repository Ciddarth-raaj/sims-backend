const logger = require("../utils/logger");

class UserUsecase {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  login(username, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = await this.userRepo.login(username, password);
        if (resp.length > 0) {
          resolve({ code: 200, ...resp[0] });
        } else {
          resolve({ code: 404, msg: "Access Denied !" });
        }
        // resolve(resp);
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = (userRepo) => {
  return new UserUsecase(userRepo);
};
