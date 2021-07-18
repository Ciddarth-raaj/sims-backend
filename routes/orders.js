const router = require("express").Router();
const Joi = require("@hapi/joi");
const respondError = require("../utils/http");

class OrdersRoutes {
  constructor(ordersUsecase) {
    this.ordersUsecase = ordersUsecase;

    this.init();
  }

  init() {
    router.post("/razorpay", async (req, res) => {
      try {
        const schema = {
          amount: Joi.number().required(),
          receipt: Joi.number().required(),
        };

        const reqBody = req.body;

        const isValid = Joi.validate(reqBody, schema);

        if (isValid.error !== null) {
          throw isValid.error;
        }

        const orderRes = await this.ordersUsecase.createRazorpay(reqBody);
        res.json(orderRes);
      } catch (err) {
        console.log(err);
        respondError(res, err);
      }

      res.end();
    });

    router.post("/", async (req, res) => {
      try {
        const schema = {
          mobile: Joi.number().required(),
        };

        const reqBody = req.body;

        const isValid = Joi.validate(reqBody, schema);

        if (isValid.error !== null) {
          throw isValid.error;
        }

        const orderRes = await this.ordersUsecase.create(reqBody);
        res.json(orderRes);
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

module.exports = (ordersUsecase) => {
  return new OrdersRoutes(ordersUsecase);
};
