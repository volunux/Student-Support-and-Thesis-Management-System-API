module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS REQUEST_TYPE;
										CREATE TABLE IF NOT EXISTS REQUEST_TYPE (

										request_type_id 	SERIAL NOT NULL,
										name 							VARCHAR(150) NOT NULL,
										abbreviation 			VARCHAR(8) NOT NULL,
										title 						VARCHAR(200),
										description 			VARCHAR(250) DEFAULT 'Not Available',

										created_on 				DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 				DATE NOT NULL DEFAULT CURRENT_DATE,
										request_type_no 	INT UNIQUE NOT NULL,
										slug 							VARCHAR(30) UNIQUE NOT NULL,

										user_id 					INT NOT NULL,
										unit_id 					INT NOT NULL,
										status_id 				INT NOT NULL,	

										CONSTRAINT REQUEST_TYPE_PKEY PRIMARY KEY(request_type_id)	

										)	

										`

}