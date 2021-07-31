const jwt = require("../services/jwt");
class UserUsecase {
  constructor(userRepo, patientsUsecase) {
    this.userRepo = userRepo;
    this.patientsUsecase = patientsUsecase;
  }

  login(username, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = await this.userRepo.login(username, password);
        if (resp.length > 0) {
          let patient_details = undefined;

          if (resp[0].user_type == 1) {
            patient_details = await this.patientsUsecase.getDetails(
              resp[0].user_id
            );
          }

          const token = await jwt.sign(
            {
              user_id: resp[0].user_id,
              role: resp[0].user_type == 1 ? "customer" : "admin",
            },
            "30d"
          );
          resolve({ code: 200, token: token, name: patient_details?.name });
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

module.exports = (userRepo, patientsUsecase) => {
  return new UserUsecase(userRepo, patientsUsecase);
};
