const router = require("express").Router();
const Joi = require("@hapi/joi");
const respondError = require("../utils/http");

class PatientsRoutes {
  constructor(patientsUsecase) {
    this.patientsUsecase = patientsUsecase;

    this.init();
  }

  init() {
    router.get("/details", async (req, res) => {
      try {
        const schema = {
          patient_id: Joi.number().required(),
        };

        const reqBody = req.query;
        reqBody.patient_id = req.decoded.id;

        const isValid = Joi.validate(reqBody, schema);

        if (isValid.error !== null) {
          throw isValid.error;
        }

        const patient = await this.patientsUsecase.getDetails(
          reqBody.patient_id
        );
        res.json(patient);
      } catch (err) {
        console.log(err);
        respondError(res, err);
      }

      res.end();
    });
  }

  getRouter() {
    return router;
  }
}

module.exports = (patientsUsecase) => {
  return new PatientsRoutes(patientsUsecase);
};
