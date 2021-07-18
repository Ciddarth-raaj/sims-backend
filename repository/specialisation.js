const logger = require("../utils/logger");

class SpecialisationRepository {
  constructor(db) {
    this.db = db;
  }

  create(specialisation) {
    return new Promise((resolve, reject) => {
      this.db.query(
        `INSERT INTO specialisations SET ?
      ON DUPLICATE KEY UPDATE ?`,
        [specialisation, specialisation],
        (err, docs) => {
          if (err) {
            logger.Log({
              level: logger.LEVEL.ERROR,
              component: "REPOSITORY.SPECIALISATION",
              code: "REPOSITORY.SPECIALISATION.CREATE",
              description: err.toString(),
              category: "",
              ref: {},
            });
            reject(err);
            return;
          }
          resolve(docs.insertId);
        }
      );
    });
  }

  get(filter) {
    return new Promise((resolve, reject) => {
      this.db.query(
        "SELECT * FROM specialisations WHERE is_active = true",
        // [doctor],
        (err, docs) => {
          if (err) {
            logger.Log({
              level: logger.LEVEL.ERROR,
              component: "REPOSITORY.SPECIALISATION",
              code: "REPOSITORY.SPECIALISATION.GET",
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
  return new SpecialisationRepository(db);
};
