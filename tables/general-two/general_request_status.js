module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS GENERAL_REQUEST_STATUS;
										CREATE TABLE IF NOT EXISTS GENERAL_REQUEST_STATUS (

										general_request_status_id			SERIAL NOT NULL,
										name													VARCHAR(150) NOT NULL,
										word													VARCHAR(20) NOT NULL,
										description										VARCHAR(250) DEFAULT 'Not Available',
										other_name										VARCHAR(20) DEFAULT 'Not Available',

										created_on										DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on										DATE NOT NULL DEFAULT CURRENT_DATE,
										general_request_status_no 		INT UNIQUE NOT NULL,
										slug													VARCHAR(30) UNIQUE NOT NULL,

										user_id								INT NOT NULL,
										status_id 						INT NOT NULL,

										CONSTRAINT GENERAL_REQUEST_STATUS_PKEY PRIMARY KEY(general_request_status_id)	)	

										`

}