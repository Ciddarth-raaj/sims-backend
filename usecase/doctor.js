const logger = require("../utils/logger");

class DoctorUsecase {
  constructor(doctorRepo) {
    this.doctorRepo = doctorRepo;
  }

  create(doctor) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.doctorRepo.create(doctor);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = (doctorRepo) => {
  return new DoctorUsecase(doctorRepo);
};