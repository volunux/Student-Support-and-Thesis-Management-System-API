module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS GENERAL_REQUEST;
										CREATE TABLE IF NOT EXISTS GENERAL_REQUEST (

										general_request_id 							SERIAL NOT NULL,
										message 												VARCHAR(1000) NOT NULL,
										request_username								VARCHAR(100) UNIQUE,
										request_password								VARCHAR(100) UNIQUE,


										created_on 											DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 											DATE NOT NULL DEFAULT CURRENT_DATE,
										general_request_no 							INT UNIQUE NOT NULL,
										slug 														VARCHAR(30) UNIQUE NOT NULL,

										handler_id											INT,

										application_number							UUID UNIQUE,


										request_type_id									INT NOT NULL,
										user_id 												INT NOT NULL,
										unit_id													INT NOT NULL,
										status_id 											INT NOT NULL,	


										CONSTRAINT GENERAL_REQUEST_PKEY PRIMARY KEY(general_request_id)	

										)	

										`

}