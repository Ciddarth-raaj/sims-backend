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
      this.db.query(
        `SELECT *,specialisations.label as specialisation  FROM doctors 
        LEFT JOIN specialisations ON doctors.specialisation = specialisations.specialisation_id
        WHERE doctors.is_active = true;`,
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
}

module.exports = (db) => {
  return new DoctorRepository(db);
};
