const router = require("express").Router();
const Joi = require("@hapi/joi");
const respondError = require("../utils/http");

class SpecialisationRoutes {
  constructor(specialisationUsecase) {
    this.specialisationUsecase = specialisationUsecase;

    this.init();
  }

  init() {
    router.post("/", async (req, res) => {
      try {
        const schema = {
          specialisation_id: Joi.number().optional(),
          label: Joi.string().required(),
          subtext: Joi.string().optional(),
          image: Joi.string().optional(),
          is_active: Joi.boolean().optional(),
        };

        const reqBody = req.body;

        const isValid = Joi.validate(reqBody, schema);

        if (isValid.error !== null) {
          throw isValid.error;
        }

        await this.specialisationUsecase.create(reqBody);
        res.json({ code: 200 });
      } catch (err) {
        console.log(err);
        respondError(res, err);
      }

      res.end();
    });

    router.get("/", async (req, res) => {
      try {
        const schema = {};

        const reqBody = req.query;

        const isValid = Joi.validate(reqBody, schema);

        if (isValid.error !== null) {
          throw isValid.error;
        }

        const specialisations = await this.specialisationUsecase.get(reqBody);
        res.json({ code: 200, data: specialisations });
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

module.exports = (specialisationUsecase) => {
  return new SpecialisationRoutes(specialisationUsecase);
};
