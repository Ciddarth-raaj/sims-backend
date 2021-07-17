const logger = require("../utils/logger");

class PatientsRepository {
  constructor(db) {
    this.db = db;
  }

  getDetails(patient_id) {
    return new Promise((resolve, reject) => {
      this.db.query(
        "SELECT name, gender, dob, area, phone, email, is_active, created_at, updated_at FROM patients WHERE is_active = true AND patient_id = ?",
        [patient_id],
        (err, docs) => {
          if (err) {
            logger.Log({
              level: logger.LEVEL.ERROR,
              component: "REPOSITORY.DOCTOR",
              code: "REPOSITORY.DOCTOR.GET-DETAILS",
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
  return new PatientsRepository(db);
};
