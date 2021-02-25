module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS LEVEL;
										CREATE TABLE IF NOT EXISTS LEVEL (

										level_id 				SERIAL NOT NULL,
										name 						VARCHAR(150) NOT NULL,
										abbreviation 		VARCHAR(8) NOT NULL,
										description 		VARCHAR(250) DEFAULT 'Not Available',

										created_on 			DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 			DATE NOT NULL DEFAULT CURRENT_DATE,
										level_no 				INT UNIQUE NOT NULL,
										slug 						VARCHAR(30) NOT NULL,

										user_id 				INT NOT NULL,
										status_id 			INT NOT NULL,	


										CONSTRAINT LEVEL_PKEY PRIMARY KEY(level_id)	

										)	

										`

}