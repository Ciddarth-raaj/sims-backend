const router = require("express").Router();
const Joi = require("@hapi/joi");
const respondError = require("../utils/http");

class UserRoutes {
  constructor(userUsecase) {
    this.userUsecase = userUsecase;

    this.init();
  }

  init() {
    router.post("/login", async (req, res) => {
      try {
        const schema = {
          username: Joi.string().required(),
          password: Joi.string().required(),
        };

        const username = req.body.username;
        const password = req.body.password;

        const isValid = Joi.validate(
          {
            username: username,
            password: password,
          },
          schema
        );

        if (isValid.error !== null) {
          throw isValid.error;
        }

        const getUserDetails = await this.userUsecase.login(
          req.body.username,
          req.body.password
        );

        res.json(getUserDetails);
      } catch (err) {
        respondError(res, err);
      }

      res.end();
    });

    router.get("/", (req, res) => {
      res.json({ code: 200, msg: "Success !" });
      res.end();
    });
  }

  getRouter() {
    return router;
  }
}

module.exports = (userUsecase) => {
  return new UserRoutes(userUsecase);
};
