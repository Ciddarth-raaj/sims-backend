const axios = require("axios");
const cron = require("node-cron");

const logger = require("../utils/logger");

const CRON_SYNTAX_GENERAL = "0 6 * * *";

class Synker {
  constructor(doctorUsecase) {
    this.doctorUsecase = doctorUsecase;
  }

  async _sync() {
    try {
      const doctors = await this._fetchDoctorDetails(1);
      const fomattedDoctors = this.transformData(doctors);
      for (let doctor of fomattedDoctors) {
        this.doctorUsecase.create(doctor);
      }
    } catch (err) {
      console.log(err);
    }
  }

  transformData(data) {
    const formatted = [];

    for (let d of data) {
      formatted.push({
        doctor_id: d.Doctor_id,
        doctor_name: d.Doctor_name,
        specialisation: d.Doctor_Specialisation,
        is_active: d.blocked == 0,
      });
    }

    return formatted;
  }

  _fetchDoctorDetails(centerid) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios({
          method: "GET",
          url:
            "https://api.simshospitals.com/TPWebServices.asmx/GetDoctor?centerid=" +
            centerid,
        });
        if (response.status !== 200) {
          logger.Log({
            level: logger.LEVEL.ERROR,
            component: "SERVICE.SYNKER",
            code: "SERVICE.SYNKER.DOCTOR-FETCH",
            description: err.toString(),
            category: "",
            ref: {},
          });
          reject();
          return;
        }
        resolve(response.data);
      } catch (err) {
        logger.Log({
          level: logger.LEVEL.ERROR,
          component: "SERVICE.SYNKER",
          code: "SERVICE.SYNKER.DOCTOR-FETCH",
          description: err.toString(),
          category: "",
          ref: {},
        });
        reject(err);
      }
    });
  }

  start() {
    cron.schedule(CRON_SYNTAX_GENERAL, () => {
      this._sync();
    });
  }
}

module.exports = (doctorUsecase) => {
  return new Synker(doctorUsecase);
};
