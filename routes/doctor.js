const router = require("express").Router();
const Joi = require("@hapi/joi");
const respondError = require("../utils/http");

class DoctorRoutes {
  constructor(doctorUsecase) {
    this.doctorUsecase = doctorUsecase;

    this.init();
  }

  init() {
    router.post("/", async (req, res) => {
      try {
        const schema = {
          doctor_id: Joi.number().optional(),
          doctor_name: Joi.string().required(),
          specialisation: Joi.string().required(),
          experience: Joi.number().optional(),
          image: Joi.string().optional(),
          email_id: Joi.string().optional(),
          phone: Joi.string().optional(),
          qualification: Joi.string().optional(),
          language: Joi.string().optional(),
          fees: Joi.number().optional(),
        };

        const reqBody = req.body;

        const isValid = Joi.validate(reqBody, schema);

        if (isValid.error !== null) {
          throw isValid.error;
        }

        await this.doctorUsecase.create(reqBody);
        res.json({ code: 200 });
      } catch (err) {
        console.log(err);
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

module.exports = (doctorUsecase) => {
  return new DoctorRoutes(doctorUsecase);
};
