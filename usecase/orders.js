const { default: axios } = require("axios");
const Razorpay = require("razorpay");
const SMS = require("../services/sms");
const EMAIL = require("../services/email");

const KEY_ID = "rzp_test_pMZx2ECklysZXf"
const KEY_SECRET = "eJLzvz94MixucBXiBIFj2Apz"

class OrdersUsecase {
  constructor(ordersRepo) {
    this.ordersRepo = ordersRepo;
  }

  createRazorpay(order_details) {
    return new Promise(async (resolve, reject) => {
      try {
        var instance = new Razorpay({
          key_id: KEY_ID,
          key_secret: KEY_SECRET,
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
          console.log(order)
          resolve(order);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  refund(order_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`https://${KEY_ID}:${KEY_SECRET}@api.razorpay.com/v1/payments/${order_id}/refund`, { speed: "optimum" })
        resolve({ code: 200 })
      } catch (err) {
        reject(err)
      }
    })
  }

  create(order) {
    return new Promise(async (resolve, reject) => {
      try {
        await EMAIL.send(
          order.email,
          "Your appointment is successfully booked")

        await SMS.send(
          order.mobile,
          "Your appointment is successfully booked"
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
