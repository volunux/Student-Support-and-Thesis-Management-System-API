module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS REQUEST_PASSWORD;
										CREATE TABLE IF NOT EXISTS REQUEST_PASSWORD (

										password_id SERIAL NOT NULL,
										password 			VARCHAR(30) NOT NULL,

										created_on 			DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 			DATE NOT NULL DEFAULT CURRENT_DATE,
										password_no INT UNIQUE NOT NULL,
										slug 						VARCHAR(30) UNIQUE NOT NULL,

										entry_id				INT NOT NULL,
										user_id 				INT NOT NULL,
										handler_id 			INT NOT NULL,
										status_id 			INT NOT NULL,	

										CONSTRAINT REQUEST_PASSWORD_PKEY PRIMARY KEY(password_id)	

										)	

										`

}