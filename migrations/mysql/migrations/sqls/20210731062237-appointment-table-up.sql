CREATE TABLE `appointments` ( `appointment_id` INT NOT NULL AUTO_INCREMENT , `patient_id` INT NOT NULL , `doctor_id` INT NOT NULL , `timeslot` DATETIME NOT NULL , `appointment_status` INT NOT NULL DEFAULT '1' , `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`appointment_id`)) ENGINE = InnoDB;
CREATE TABLE `appointment_status` ( `status_id` INT NOT NULL AUTO_INCREMENT , `label` INT NOT NULL , `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`status_id`)) ENGINE = InnoDB;
ALTER TABLE `appointment_status` CHANGE `label` `label` VARCHAR(50) NOT NULL;
INSERT INTO `appointment_status` (`status_id`, `label`, `created_at`) VALUES ('1', 'Pending Confirmation', CURRENT_TIMESTAMP), ('2', 'Confirmed', CURRENT_TIMESTAMP), ('3', 'Completed', CURRENT_TIMESTAMP), ('4', 'Missed', CURRENT_TIMESTAMP), ('5', 'Cancelled', CURRENT_TIMESTAMP)