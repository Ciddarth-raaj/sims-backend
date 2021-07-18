const axios = require("axios");
const cron = require("node-cron");

const logger = require("../utils/logger");

const CRON_SYNTAX_GENERAL = "0 6 * * *";

class Synker {
  constructor(doctorUsecase, specialisationUsecase) {
    this.doctorUsecase = doctorUsecase;
    this.specialisationUsecase = specialisationUsecase;
  }

  async _sync() {
    try {
      const doctors = await this._fetchDoctorDetails(1);
      const formatted = await this.transformData(doctors);

      for (let doctor of formatted) {
        this.doctorUsecase.create(doctor);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async transformData(data) {
    const formatted = [];
    const specialisations = await this.specialisationUsecase.get();

    const specialisationMap = {};

    for (const s of specialisations) {
      specialisationMap[s.label] = s.specialisation_id;
    }

    for (let d of data) {
      if (specialisationMap[d.Doctor_Specialisation] != undefined) {
        d.Doctor_Specialisation = specialisationMap[d.Doctor_Specialisation];
      } else {
        d.Doctor_Specialisation = await this.specialisationUsecase.create({
          label: d.Doctor_Specialisation,
        });
      }

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

module.exports = (doctorUsecase, specialisationUsecase) => {
  return new Synker(doctorUsecase, specialisationUsecase);
};
