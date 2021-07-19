const Razorpay = require("razorpay");
const SMS = require("../services/sms");
class OrdersUsecase {
  constructor(ordersRepo) {
    this.ordersRepo = ordersRepo;
  }

  createRazorpay(order_details) {
    return new Promise(async (resolve, reject) => {
      try {
        var instance = new Razorpay({
          key_id: "rzp_test_pMZx2ECklysZXf",
          key_secret: "eJLzvz94MixucBXiBIFj2Apz",
        });

        var options = {
          amount: order_details.amount,
          currency: "INR",
          receipt: order_details.receipt,
        };
        instance.orders.create(options, function (err, order) {
          if (err) {
            resolve({ code: err.statusCode, error: err.error });
            return;
          }
          resolve(order);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  create(order) {
    return new Promise(async (resolve, reject) => {
      try {
        await SMS.send(
          order.mobile,
          "Dear xxxx Your Appointment has been fixed with xxxx xxxx on xxxx at xxxx in xxxx. Please Make yourself available 15 Min before the Appointment in the Hospitals"
        );
        resolve({ code: 200 });
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = (ordersRepo) => {
  return new OrdersUsecase(ordersRepo);
};
