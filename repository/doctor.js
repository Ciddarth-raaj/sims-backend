const logger = require("../utils/logger");

class DoctorRepository {
  constructor(db) {
    this.db = db;
  }

  create(doctor) {
    return new Promise((resolve, reject) => {
      this.db.query(
        `INSERT INTO doctors SET ?
      ON DUPLICATE KEY UPDATE ?`,
        [doctor, doctor],
        (err, docs) => {
          if (err) {
            logger.Log({
              level: logger.LEVEL.ERROR,
              component: "REPOSITORY.DOCTOR",
              code: "REPOSITORY.DOCTOR.CREATE",
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

  get(filter) {
    return new Promise((resolve, reject) => {
      const filterQuery = this._extractFilter(filter, "AND");
      this.db.query(
        `SELECT *,specialisations.label as specialisation  FROM doctors 
        LEFT JOIN specialisations ON doctors.specialisation = specialisations.specialisation_id
        WHERE doctors.is_active = true ${filterQuery}`,
        // [doctor],
        (err, docs) => {
          if (err) {
            logger.Log({
              level: logger.LEVEL.ERROR,
              component: "REPOSITORY.DOCTOR",
              code: "REPOSITORY.DOCTOR.GET",
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

  getById(doctor_id) {
    return new Promise((resolve, reject) => {
      this.db.query(
        `SELECT *,specialisations.label as specialisation  FROM doctors 
        LEFT JOIN specialisations ON doctors.specialisation = specialisations.specialisation_id
        WHERE doctors.is_active = true AND doctor_id = ?`,
        [doctor_id],
        (err, docs) => {
          if (err) {
            logger.Log({
              level: logger.LEVEL.ERROR,
              component: "REPOSITORY.DOCTOR",
              code: "REPOSITORY.DOCTOR.GET-BY-ID",
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

  _extractFilter(filter, start) {
    if (filter == undefined) {
      return "";
    }

    let query = start == undefined ? "WHERE" : start;

    if (filter.specialisations) {
      query +=
        " doctors.specialisation IN (" +
        filter.specialisations.join(",") +
        ") AND";
    }

    if (query.endsWith("AND")) {
      query = query.substr(0, query.length - 4);
    } else if (query.endsWith("WHERE")) {
      query = query.substr(0, query.length - 5);
    }

    return query;
  }

  getEmail(doctor_id) {
    return new Promise((resolve, reject) => {
      this.db.query(
        "SELECT email_id, phone FROM doctors WHERE doctor_id = ?",
        [doctor_id],
        (err, docs) => {
          if (err) {
            logger.Log({
              level: logger.LEVEL.ERROR,
              component: "REPOSITORY.DOCTOR",
              code: "REPOSITORY.DOCTOR.GET-EMAIL",
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
}

module.exports = (db) => {
  return new DoctorRepository(db);
};
