const jwt = require("../services/jwt");
class UserUsecase {
  constructor(userRepo, patientsUsecase, doctorUsecase) {
    this.userRepo = userRepo;
    this.patientsUsecase = patientsUsecase;
    this.doctorUsecase = doctorUsecase;
  }

  login(username, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = await this.userRepo.login(username, password);
        if (resp.length > 0) {
          let user_details = undefined;

          if (resp[0].user_type == 1) {
            user_details = await this.patientsUsecase.getDetails(resp[0].user_id);
          } else if (resp[0].user_type == 2) {
            user_details = await this.doctorUsecase.getById(resp[0].user_id);
            user_details.name = user_details.doctor_name;
          }

          const token = await jwt.sign(
            {
              user_id: resp[0].user_id,
              role: resp[0].user_type == 1 ? "patient" : "doctor",
            },
            "30d"
          );
          resolve({ code: 200, token: token, name: user_details?.name, role_id: resp[0].user_type });
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

module.exports = (userRepo, patientsUsecase, doctorUsecase) => {
  return new UserUsecase(userRepo, patientsUsecase, doctorUsecase);
};
