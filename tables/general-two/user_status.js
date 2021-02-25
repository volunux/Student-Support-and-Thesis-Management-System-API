module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS USER_STATUS;
										CREATE TABLE IF NOT EXISTS USER_STATUS (

										user_status_id		SERIAL NOT NULL,
										name							VARCHAR(150) NOT NULL,
										word							VARCHAR(20) NOT NULL,
										description				VARCHAR(250) DEFAULT 'Not Available',

										created_on				DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on				DATE NOT NULL DEFAULT CURRENT_DATE,
										user_status_no 		INT UNIQUE NOT NULL,
										slug 							VARCHAR(30) UNIQUE NOT NULL,

										user_id 					INT NOT NULL,
										status_id 				INT NOT NULL,

										CONSTRAINT USER_STATUS_PKEY PRIMARY KEY(user_status_id)	

										)	

										`

}