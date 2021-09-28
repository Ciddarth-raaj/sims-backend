const logger = require("../utils/logger");

class AppointmentUsecase {
  constructor(appointmentRepo) {
    this.appointmentRepo = appointmentRepo;
  }

  create(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const bookedAppointments = await this.checkSlot(
          data.doctor_id,
          data.timeslot
        );

        if (bookedAppointments.length >= 1) {
          resolve({ code: 201 });
          return;
        }

        await this.appointmentRepo.create(data);
        resolve({ code: 200 });
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  update(data) {
    return new Promise(async (resolve, reject) => {
      try {
        if (data.timeslot !== undefined) {
          const appointment = await this.getByAppointmentId(data.appointment_id);

          if (appointment.code == 404) {
            resolve({ code: 404 });
            return;
          }

          const bookedAppointments = await this.checkSlot(appointment.doctor_id, data.timeslot);

          if (bookedAppointments.length >= 1) {
            resolve({ code: 201 });
            return;
          }
        }

        await this.appointmentRepo.update(data);

        if (data.appointment_status != undefined || data.appointment_status != null || data.appointment_status == 2) {
          try {
            const Meeting = require('google-meet-api').meet;

            const result = await Meeting({
              clientId: '156374965130-mmgtjkm9bu2vmq40dt83919orld14nde.apps.googleusercontent.com',
              clientSecret: 'HDnHtnH05ypZwpVmvGRABEuj',
              refreshToken: '1//04gvvc8zri5gHCgYIARAAGAQSNwF-L9Ir2dH8W8hW3ES6drbx5te7b71mWHO-AYdoy_eKy2GGrPRvdqaF5t1LKws5TEF7TjldBfg',
              date: "2020-12-01",
              time: "12:59",
              summary: 'summary',
              location: 'location',
              description: 'description'
            })
            console.log(result)
          } catch (err) {
            console.log("Error sending email!")
          }
        }

        resolve({ code: 200 });
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  checkSlot(doctor_id, timeslot) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await this.appointmentRepo.checkSlot(doctor_id, timeslot);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  getById(patient_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const appointments = await this.appointmentRepo.getById(patient_id);
        resolve(appointments);
      } catch (err) {
        reject(err);
      }
    });
  }

  getByDoctorId(doctor_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const appointments = await this.appointmentRepo.getByDoctorId(doctor_id);
        resolve(appointments);
      } catch (err) {
        reject(err);
      }
    });
  }

  getUpcoming(patient_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const appointments = await this.appointmentRepo.getUpcoming(patient_id);
        resolve(appointments);
      } catch (err) {
        reject(err);
      }
    });
  }

  getByAppointmentId(appointment_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const appointments = await this.appointmentRepo.getByAppointmentId(
          appointment_id
        );

        if (appointments.length <= 0) {
          resolve({ code: 404 });
          return;
        }

        resolve({ code: 200, ...appointments[0] });
      } catch (err) {
        reject(err);
      }
    });
  }

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
