const logger = require("../utils/logger");

class PatientsUsecase {
  constructor(patientsRepo) {
    this.patientsRepo = patientsRepo;
  }

  getDetails(patient_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const patients = await this.patientsRepo.getDetails(patient_id);
        if (patients.length > 0) {
          resolve({ code: 200, ...patients[0] });
          return;
        } else {
          resolve({ code: 404 });
        }
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = (patientsRepo) => {
  return new PatientsUsecase(patientsRepo);
};
