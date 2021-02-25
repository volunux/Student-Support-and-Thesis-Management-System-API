module.exports = {
	
	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS DEPARTMENT;
										CREATE TABLE IF NOT EXISTS DEPARTMENT (

										department_id 		SERIAL NOT NULL,
										name 							VARCHAR(150) NOT NULL,
										abbreviation 			VARCHAR(8) NOT NULL,
										description 			VARCHAR(250) DEFAULT 'Not Available',

										created_on 				DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 				DATE NOT NULL DEFAULT CURRENT_DATE,
										department_no			INT UNIQUE NOT NULL ,
										slug 							VARCHAR(30) UNIQUE NOT NULL,

										faculty_id 				INT NOT NULL,
										user_id 					INT NOT NULL,
										status_id 				INT NOT NULL,	

										CONSTRAINT DEPARTMENT_PKEY PRIMARY KEY(department_id)

										)

										`

}

