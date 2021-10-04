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

  get(filter) {
    return new Promise(async (resolve, reject) => {
      try {
        const doctors = await this.doctorRepo.get(filter);
        resolve(doctors);
      } catch (err) {
        reject(err);
      }
    });
  }

  getById(doctor_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const doctors = await this.doctorRepo.getById(doctor_id);
        if (doctors.length > 0) {
          resolve({ code: 200, ...doctors[0] });
        } else {
          resolve({ code: 404 });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  getEmail(doctor_id) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve((await this.doctorRepo.getEmail(doctor_id))[0])
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = (doctorRepo) => {
  return new DoctorUsecase(doctorRepo);
};
