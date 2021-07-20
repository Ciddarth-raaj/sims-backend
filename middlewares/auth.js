const jwt = require("../services/jwt");

const unProtectedRoutes = {
  "/user/login": {
    methods: { post: true },
  },
  "/doctor": {
    methods: { post: true, get: true },
  },
  "/specialisation": {
    methods: { post: true, get: true },
  },
  "/orders/razorpay": {
    methods: { post: true },
  },
  "/orders": {
    methods: { post: true },
  },
  "/doctor/id": {
    methods: { get: true },
  },
};

async function auth(req, res, next) {
  if (
    unProtectedRoutes[req.path] &&
    unProtectedRoutes[req.path]["methods"][req.method.toLowerCase()]
  ) {
    next();
    return;
  }

  try {
    const token = req.headers["x-access-token"];
    if (token === undefined) {
      res.json({ code: 403, msg: "Access Denied", path: req.path });
      res.end();
      return;
    } else {
      const decoded = await jwt.verify(token);
      req.decoded = {};
      req.decoded.id = decoded.user_id;
      req.decoded.role = decoded.role;

      // if (decoded.role !== "ADMIN") {
      //   res.json({ code: 403, msg: "Access Denied", path: req.path });
      //   res.end();
      //   return;
      // }
    }
  } catch (err) {
    res.json({ code: 403, msg: "Access Denied", path: req.path });
    res.end();
    return;
  }

  next();
}

module.exports = auth;
