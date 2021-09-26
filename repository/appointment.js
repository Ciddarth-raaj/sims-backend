const logger = require("../utils/logger");

class DoctorRepository {
  constructor(db) {
    this.db = db;
  }

  create(data) {
    return new Promise((resolve, reject) => {
      this.db.query(`INSERT INTO appointments SET ?`, [data], (err, docs) => {
        if (err) {
          logger.Log({
            level: logger.LEVEL.ERROR,
            component: "REPOSITORY.APPOINTMENT",
            code: "REPOSITORY.APPOINTMENT.CREATE",
            description: err.toString(),
            category: "",
            ref: {},
          });
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  update(data) {
    return new Promise((resolve, reject) => {
      const appointment_id = data.appointment_id;
      delete data.appointment_id;

      this.db.query(
        `UPDATE appointments SET ? WHERE appointment_id = ?`,
        [data, appointment_id],
        (err, docs) => {
          if (err) {
            logger.Log({
              level: logger.LEVEL.ERROR,
              component: "REPOSITORY.APPOINTMENT",
              code: "REPOSITORY.APPOINTMENT.UPDATE",
              description: err.toString(),
              category: "",
              ref: {},
            });
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  }

  checkSlot(doctor_id, timeslot) {
    return new Promise((resolve, reject) => {
      this.db.query(
        `SELECT * FROM appointments WHERE doctor_id = ?
        AND timeslot > DATE_ADD(?, INTERVAL -30 MINUTE)
        AND timeslot < DATE_ADD(?, INTERVAL 30 MINUTE)`,
        [doctor_id, timeslot, timeslot],
        (err, docs) => {
          if (err) {
            logger.Log({
              level: logger.LEVEL.ERROR,
              component: "REPOSITORY.APPOINTMENT",
              code: "REPOSITORY.APPOINTMENT.CHECK-SLOT",
              description: err.toString(),
              category: "",
              ref: {},
            });
            reject(err);
            return;
          }
          resolve(docs);
        }
      );
    });
  }

  getById(patient_id) {
    return new Promise((resolve, reject) => {
      this.db.query(
        `SELECT appointment_id, appointments.doctor_id, doctor_name, image, label as status, status_id, timeslot,appointments.created_at,
        IF(status_id = 5, 1, 0) as cancelled
        FROM appointments
        LEFT JOIN doctors ON appointments.doctor_id = doctors.doctor_id
        LEFT JOIN appointment_status ON appointment_status.status_id = appointment_status
        WHERE patient_id = ?
        ORDER BY cancelled ASC, timeslot`,
        [patient_id],
        (err, docs) => {
          if (err) {
            logger.Log({
              level: logger.LEVEL.ERROR,
              component: "REPOSITORY.DOCTOR",
              code: "REPOSITORY.DOCTOR.GET-By-ID",
              description: err.toString(),
              category: "",
              ref: {},
            });
            reject(err);
            return;
          }
          resolve(docs);
        }
      );
    });
  }

  getByDoctorId(doctor_id) {
    return new Promise((resolve, reject) => {
      this.db.query(
        `SELECT appointment_id, name, label as status, status_id, timeslot,appointments.created_at,
        IF(status_id = 5, 1, 0) as cancelled
        FROM appointments
        LEFT JOIN patients ON appointments.patient_id = patients.patient_id
        LEFT JOIN appointment_status ON appointment_status.status_id = appointment_status
        WHERE doctor_id = ?
        ORDER BY cancelled ASC, timeslot`,
        [doctor_id],
        (err, docs) => {
          if (err) {
            logger.Log({
              level: logger.LEVEL.ERROR,
              component: "REPOSITORY.DOCTOR",
              code: "REPOSITORY.DOCTOR.GET-BY-DOCTOR-ID",
              description: err.toString(),
              category: "",
              ref: {},
            });
            reject(err);
            return;
          }
          resolve(docs);
        }
      );
    });
  }

  getUpcoming(patient_id) {
    return new Promise((resolve, reject) => {
      this.db.query(
        `SELECT appointment_id, appointments.doctor_id, doctor_name, image, label as status, status_id, timeslot,appointments.created_at
        FROM appointments
        LEFT JOIN doctors ON appointments.doctor_id = doctors.doctor_id
        LEFT JOIN appointment_status ON appointment_status.status_id = appointment_status
        WHERE patient_id = ? AND DATE(timeslot) = DATE(NOW()) AND timeslot >= CURTIME() AND status_id != 5
        ORDER BY timeslot`,
        [patient_id],
        (err, docs) => {
          if (err) {
            logger.Log({
              level: logger.LEVEL.ERROR,
              component: "REPOSITORY.DOCTOR",
              code: "REPOSITORY.DOCTOR.GET-By-ID",
              description: err.toString(),
              category: "",
              ref: {},
            });
            reject(err);
            return;
          }
          resolve(docs);
        }
      );
    });
  }

  getByAppointmentId(appointment_id) {
    return new Promise((resolve, reject) => {
      this.db.query(
        `SELECT appointment_id, appointments.doctor_id, doctor_name, image, label as status, status_id, timeslot,appointments.created_at FROM appointments
        LEFT JOIN doctors ON appointments.doctor_id = doctors.doctor_id
        LEFT JOIN appointment_status ON appointment_status.status_id = appointment_status
        WHERE appointment_id = ?
        ORDER BY timeslot`,
        [appointment_id],
        (err, docs) => {
          if (err) {
            logger.Log({
              level: logger.LEVEL.ERROR,
              component: "REPOSITORY.DOCTOR",
              code: "REPOSITORY.DOCTOR.GET-BY-APP-ID",
              description: err.toString(),
              category: "",
              ref: {},
            });
            reject(err);
            return;
          }
          resolve(docs);
        }
      );
    });
  }

  // getById(doctor_id) {
  //   return new Promise((resolve, reject) => {
  //     this.db.query(
  //       `SELECT *,specialisations.label as specialisation  FROM doctors
  //       LEFT JOIN specialisations ON doctors.specialisation = specialisations.specialisation_id
  //       WHERE doctors.is_active = true AND doctor_id = ?`,
  //       [doctor_id],
  //       (err, docs) => {
  //         if (err) {
  //           logger.Log({
  //             level: logger.LEVEL.ERROR,
  //             component: "REPOSITORY.DOCTOR",
  //             code: "REPOSITORY.DOCTOR.GET-BY-ID",
  //             description: err.toString(),
  //             category: "",
  //             ref: {},
  //           });
  //           reject(err);
  //           return;
  //         }
  //         resolve(docs);
  //       }
  //     );
  //   });
  // }

  // _extractFilter(filter, start) {
  //   if (filter == undefined) {
  //     return "";
  //   }

  //   let query = start == undefined ? "WHERE" : start;

  //   if (filter.specialisations) {
  //     query +=
  //       " doctors.specialisation IN (" +
  //       filter.specialisations.join(",") +
  //       ") AND";
  //   }

  //   if (query.endsWith("AND")) {
  //     query = query.substr(0, query.length - 4);
  //   } else if (query.endsWith("WHERE")) {
  //     query = query.substr(0, query.length - 5);
  //   }

  //   return query;
  // }
}

module.exports = (db) => {
  return new DoctorRepository(db);
};
