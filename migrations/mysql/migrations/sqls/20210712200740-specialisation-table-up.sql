CREATE TABLE `specialisations` ( `specialisation_id` INT NOT NULL AUTO_INCREMENT , `label` VARCHAR(50) NOT NULL , `subtext` VARCHAR(100) NULL , `image` TEXT NULL , `is_active` TINYINT NOT NULL DEFAULT '1' , `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`specialisation_id`)) ENGINE = InnoDB;