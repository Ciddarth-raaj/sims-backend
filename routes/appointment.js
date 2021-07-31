const router = require("express").Router();
const Joi = require("@hapi/joi");
const respondError = require("../utils/http");
const moment = require("moment");

class AppointmentRoutes {
  constructor(appointmentUsecase) {
    this.appointmentUsecase = appointmentUsecase;

    this.init();
  }

  init() {
    router.post("/", async (req, res) => {
      try {
        const schema = {
          patient_id: Joi.number().required(),
          doctor_id: Joi.number().required(),
          timeslot: Joi.date().required(),
        };

        const reqBody = req.body;
        console.log(reqBody);
        reqBody.patient_id = req.decoded.id;
        reqBody.timeslot = moment(new Date(reqBody.timeslot)).format(
          "YYYY-MM-DD HH:mm:ss"
        );

        const isValid = Joi.validate(reqBody, schema);

        if (isValid.error !== null) {
          throw isValid.error;
        }

        const data = await this.appointmentUsecase.create(reqBody);
        res.json(data);
      } catch (err) {
        console.log(err);
        respondError(res, err);
      }

      res.end();
    });

    router.get("/", async (req, res) => {
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

        const data = await this.appointmentUsecase.getById(reqBody.patient_id);
        res.json(data);
      } catch (err) {
        console.log(err);
        respondError(res, err);
      }

      res.end();
    });

    // router.get("/id", async (req, res) => {
    //   try {
    //     const schema = {
    //       doctor_id: Joi.number().optional(),
    //     };

    //     const reqBody = req.query;

    //     const isValid = Joi.validate(reqBody, schema);

    //     if (isValid.error !== null) {
    //       throw isValid.error;
    //     }

    //     const doctors = await this.appointmentUsecase.getById(reqBody.doctor_id);
    //     res.json(doctors);
    //   } catch (err) {
    //     console.log(err);
    //     respondError(res, err);
    //   }

    //   res.end();
    // });
  }

  getRouter() {
    return router;
  }
}

module.exports = (appointmentUsecase) => {
  return new AppointmentRoutes(appointmentUsecase);
};
