module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS REQUEST_CREDENTIAL;
										CREATE TABLE IF NOT EXISTS REQUEST_CREDENTIAL (

										credential_id SERIAL NOT NULL,
										username 			VARCHAR(30) NOT NULL,
										password 			VARCHAR(30) NOT NULL,

										created_on 			DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 			DATE NOT NULL DEFAULT CURRENT_DATE,
										credential_no INT UNIQUE NOT NULL,
										slug 						VARCHAR(30) UNIQUE NOT NULL,

										entry_id				INT NOT NULL,
										user_id 				INT NOT NULL,
										handler_id 			INT NOT NULL,
										status_id 			INT NOT NULL,	

										CONSTRAINT REQUEST_CREDENTIAL_PKEY PRIMARY KEY(credential_id)	

										)	

										`

}