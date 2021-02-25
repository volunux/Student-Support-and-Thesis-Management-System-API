module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS ROLE;
										CREATE TABLE IF NOT EXISTS ROLE (

										role_id					SERIAL NOT NULL,
										name 						VARCHAR(150) NOT NULL,
										word 						VARCHAR(20) NOT NULL,
										description 		VARCHAR(250) DEFAULT 'Not Available',

										created_on 			DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 			DATE NOT NULL DEFAULT CURRENT_DATE,
										role_no 				INT UNIQUE NOT NULL,
										slug 						VARCHAR(30) UNIQUE NOT NULL,

										user_id 				INT NOT NULL,
										status_id 			INT NOT NULL,

										CONSTRAINT ROLE_PKEY PRIMARY KEY(role_id)

										)	

										`

}