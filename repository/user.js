const logger = require("../utils/logger");

class UserRepository {
  constructor(db) {
    this.db = db;
  }

  login(username, password) {
    return new Promise((resolve, reject) => {
      this.db.query(
        "SELECT user_id FROM users WHERE username = ? AND password = SHA1(?)",
        [username, password],
        (err, docs) => {
          if (err) {
            logger.Log({
              level: logger.LEVEL.ERROR,
              component: "REPOSITORY.USER",
              code: "REPOSITORY.USER.LOGIN",
              description: err.toString(),
              category: "",
              ref: {},
            });
            reject(err);
            return;
          }
          if (docs.length > 0) {
            resolve({ code: 200, data: docs[0] });
          } else {
            resolve({ code: 404, msg: "Access Denied !" });
          }
        }
      );
    });
  }
}

module.exports = (db) => {
  return new UserRepository(db);
};
