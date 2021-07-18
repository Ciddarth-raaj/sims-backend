const logger = require("../utils/logger");

class SpecialisationUsecase {
  constructor(specialisationRepo) {
    this.specialisationRepo = specialisationRepo;
  }

  create(doctor) {
    return new Promise(async (resolve, reject) => {
      try {
        const inserted_id = await this.specialisationRepo.create(doctor);
        resolve(inserted_id);
      } catch (err) {
        reject(err);
      }
    });
  }

  get(filter) {
    return new Promise(async (resolve, reject) => {
      try {
        const specialisations = await this.specialisationRepo.get(filter);
        resolve(specialisations);
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = (specialisationRepo) => {
  return new SpecialisationUsecase(specialisationRepo);
};
