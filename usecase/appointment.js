const logger = require("../utils/logger");
const CalendarAPI = require("../utils/calendar-api");

class AppointmentUsecase {
  constructor(appointmentRepo, userUsecase) {
    this.appointmentRepo = appointmentRepo;
    this.userUsecase = userUsecase;
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
        const appointment = await this.getByAppointmentId(data.appointment_id);
        if (appointment.code == 404) {
          resolve({ code: 404 });
          return;
        }

        if (data.timeslot !== undefined) {
          const bookedAppointments = await this.checkSlot(appointment.doctor_id, data.timeslot);

          if (bookedAppointments.length >= 1) {
            resolve({ code: 201 });
            return;
          }
        }

        await this.appointmentRepo.update(data);

        if (data.appointment_status != undefined || data.appointment_status != null || data.appointment_status == 2) {
          try {
            const doctor_email = (await this.userUsecase.getEmailById(appointment.doctor_id, 2)).email_id;
            const patient_email = (await this.userUsecase.getEmailById(appointment.patient_id, 1)).email;
            const startTime = new Date(appointment.timeslot);
            const endTime = new Date(startTime.getTime() + 30 * 60000);
            const attendees = [];

            if (doctor_email != null && doctor_email != undefined) {
              attendees.push({ email: doctor_email })
            }

            if (patient_email != null && patient_email != undefined) {
              attendees.push({ email: patient_email })
            }

            const meeting_response = await CalendarAPI(appointment.appointment_id, startTime, endTime, `Appointment with ${appointment.doctor_name}`, `Scheduled appointment through SIMS App`, attendees)
            if (meeting_response.code == 200) {
              await this.appointmentRepo.update({ meeting_link: meeting_response.link, appointment_id: appointment.appointment_id });
            }
          } catch (err) {
            console.log(err)
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

  getTimeSlots(doctor_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const moment = require("moment");

        const timeSlots = await this.appointmentRepo.getTimeSlots(doctor_id);
        const timeMap = {}

        timeSlots.forEach(time => {
          const date = moment(new Date(time.timeslot)).format("DD/MM/YY")
          if (timeMap[date] === undefined) {
            timeMap[date] = []
          }

          timeMap[date].push(time.timeslot)
        });

        resolve({ code: 200, data: timeMap });
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

module.exports = (appointmentRepo, userUsecase) => {
  return new AppointmentUsecase(appointmentRepo, userUsecase);
};
