global.env =
  process.env.NODE_ENV === undefined ? "development" : process.env.NODE_ENV;
global.isDev = () => {
  return global.env === "development";
};

const PORT = process.env.PORT === undefined ? 8080 : process.env.PORT;

const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const HttpServer = require("http").createServer(app);

const logger = require("./utils/logger");

class Server {
  constructor() {
    this.drivers = [];
    this.init();
  }

  async init() {
    try {
      await this.initDrivers();

      this.initRepositories();
      this.initUsecases();
      this.initServices();
      this.initExpress();
      this.initRoutes();
      this.initServer();
    } catch (err) {
      process.exit(err);
    }
  }

  initExpress() {
    app.use(require("cors")());

    const colours = {
      GET: "\x1b[32m",
      POST: "\x1b[34m",
      DELETE: "\x1b[31m",
      PUT: "\x1b[33m",
    };
    app.use("*", (req, _, next) => {
      if (global.isDev()) {
        console.log(colours[req.method] + req.method, "\x1b[0m" + req.baseUrl);
      }
      next();
    });

    //Enable request compression
    app.use(compression());
    app.use(bodyParser.json()); // to support JSON-encoded bodies
    app.use(
      bodyParser.urlencoded({
        // to support URL-encoded bodies
        extended: true,
      })
    );
    app.use(express.static(__dirname + "/views", { maxAge: "30 days" }));
  }

  initServer() {
    HttpServer.listen(PORT, () => {
      console.log(`Server Running ${PORT}`);
    });
  }

  initDrivers() {
    return new Promise(async (resolve, reject) => {
      try {
        this.mysql = await require("./drivers/mysql")().connect();
        //this.mongo = require('./models/mongo')().connect();

        this.drivers.push(this.mysql);
        //this.models.push(this.mongo);

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  initServices() {
    this.synker = require("./services/synker")(
      this.doctorUsecase,
      this.specialisationUsecase
    );
    this.synker._sync(); //Use for immediate doctor details sync
    // this.synker.start(); //Use to start CRON job
  }

  initRepositories() {
    this.userRepo = require("./repository/user")(this.mysql.connection);
    this.doctorRepo = require("./repository/doctor")(this.mysql.connection);
    this.patientsRepo = require("./repository/patients")(this.mysql.connection);
    this.specialisationRepo = require("./repository/specialisation")(
      this.mysql.connection
    );
    this.appointmentRepo = require("./repository/appointment")(
      this.mysql.connection
    );
    // this.doctorRepo = require("./repository/doctor")(this.mysql.connection);
  }

  initUsecases() {
    this.patientsUsecase = require("./usecase/patients")(this.patientsRepo);
    this.doctorUsecase = require("./usecase/doctor")(this.doctorRepo);
    this.userUsecase = require("./usecase/user")(this.userRepo, this.patientsUsecase, this.doctorUsecase);
    this.specialisationUsecase = require("./usecase/specialisation")(this.specialisationRepo);
    this.ordersUsecase = require("./usecase/orders")(this.ordersRepo);
    this.appointmentUsecase = require("./usecase/appointment")(this.appointmentRepo, this.userUsecase, this.ordersUsecase);
  }

  initRoutes() {
    const authMiddleWare = require("./middlewares/auth");
    app.use(authMiddleWare);

    const userRouter = require("./routes/user")(this.userUsecase);
    const doctorRouter = require("./routes/doctor")(this.doctorUsecase);
    const patientsRouter = require("./routes/patients")(this.patientsUsecase);
    const specialisationRouter = require("./routes/specialisation")(
      this.specialisationUsecase
    );
    const ordersRouter = require("./routes/orders")(this.ordersUsecase);
    const appointmentRouter = require("./routes/appointment")(
      this.appointmentUsecase
    );

    app.use("/user", userRouter.getRouter());
    app.use("/doctor", doctorRouter.getRouter());
    app.use("/specialisation", specialisationRouter.getRouter());
    app.use("/orders", ordersRouter.getRouter());
    app.use("/patients", patientsRouter.getRouter());
    app.use("/appointment", appointmentRouter.getRouter());
  }

  onClose() {
    //Close all DB Connections
    this.drivers.map((m) => {
      m.close();
    });

    HttpServer.close();
  }
}

const server = new Server();

[
  "SIGINT",
  "SIGTERM",
  "SIGQUIT",
  "exit",
  "uncaughtException",
  "SIGUSR1",
  "SIGUSR2",
].forEach((eventType) => {
  process.on(eventType, (err = "") => {
    process.removeAllListeners();

    let error = err.toString();

    if (err.stack) {
      error = err.stack;
    }

    logger.Log({
      level: logger.LEVEL.ERROR,
      component: "SERVER",
      code: "SERVER.EXIT",
      description: error,
      category: "",
      ref: {},
    });
    server.onClose();
  });
});
