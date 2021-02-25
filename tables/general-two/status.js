module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS STATUS;
										CREATE TABLE IF NOT EXISTS STATUS (

										status_id					SERIAL NOT NULL,
										name							VARCHAR(150) NOT NULL,
										word							VARCHAR(20) NOT NULL,
										description				VARCHAR(250) DEFAULT 'Not Available',

										created_on				DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on				DATE NOT NULL DEFAULT CURRENT_DATE,
										status_no 				INT UNIQUE NOT NULL,
										slug							VARCHAR(30) UNIQUE NOT NULL,

										user_id						INT NOT NULL,

										CONSTRAINT STATUS_PKEY PRIMARY KEY(status_id)	)	

										`

}