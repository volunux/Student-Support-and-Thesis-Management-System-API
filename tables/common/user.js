module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS USERS;
										CREATE TABLE IF NOT EXISTS USERS (

										user_id 				SERIAL NOT NULL,
										first_name 			VARCHAR(20) NOT NULL,
										last_name 			VARCHAR(20) NOT NULL,

										username 				VARCHAR(20) UNIQUE NOT NULL,
										email_address 	VARCHAR(50) UNIQUE NOT NULL,
										about 					VARCHAR(300) NOT NULL,
										user_no 				INT UNIQUE NOT NULL,


										matriculation_number 			VARCHAR(30) UNIQUE,
										jamb_registration_number	VARCHAR(30) UNIQUE,
										identity_number						VARCHAR(30) UNIQUE,

										last_logged_in	DATE,
										hash						TEXT,
										salt						TEXT,

										reset_password_token 		TEXT,
										reset_password_expires 	TEXT,

										department_id 					INT NOT NULL,
										faculty_id 							INT NOT NULL,
										country_id 							INT NOT NULL,
										level_id								INT NOT NULL,
										role_id									INT NOT NULL,
										unit_id									INT NOT NULL,
										status_id								INT NOT NULL,

										created_on				DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on				DATE NOT NULL DEFAULT CURRENT_DATE,
										slug							VARCHAR(30) UNIQUE NOT NULL,

										profile_photo_id	INT,
										signature_id			INT,


										CONSTRAINT USERS_PKEY PRIMARY KEY(user_id)	

										)	

										`
}