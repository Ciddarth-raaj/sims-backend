const logger = require("../utils/logger");

class AppointmentUsecase {
  constructor(appointmentRepo) {
    this.appointmentRepo = appointmentRepo;
  }

  create(data) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.appointmentRepo.create(data);
        resolve({ code: 200 })
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  // get(filter) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const doctors = await this.appointmentRepo.get(filter);
  //       resolve(doctors);
  //     } catch (err) {
  //       reject(err);
  //     }
  //   });
  // }

  // getById(doctor_id) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const doctors = await this.appointmentRepo.getById(doctor_id);
  //       if (doctors.length > 0) {
  //         resolve({ code: 200, ...doctors[0] });
  //       } else {
  //         resolve({ code: 404 });
  //       }
  //     } catch (err) {
  //       reject(err);
  //     }
  //   });
  // }
}

module.exports = (appointmentRepo) => {
  return new AppointmentUsecase(appointmentRepo);
};
