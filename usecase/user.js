const jwt = require("../services/jwt");
class UserUsecase {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  login(username, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = await this.userRepo.login(username, password);
        if (resp.length > 0) {
          const token = await jwt.sign(
            {
              user_id: resp[0].user_id,
              role: resp[0].user_type == 1 ? "customer" : "admin",
            },
            "30d"
          );
          resolve({ code: 200, token: token });
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
