module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS ACCOUNT_CHANGE_REQUEST;
										CREATE TABLE IF NOT EXISTS ACCOUNT_CHANGE_REQUEST (

										account_change_request_id 			SERIAL NOT NULL,
										message 												VARCHAR(1000) NOT NULL,

										created_on 											DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 											DATE NOT NULL DEFAULT CURRENT_DATE,
										account_change_request_no				INT UNIQUE NOT NULL,
										slug 														VARCHAR(30) UNIQUE NOT NULL,

										handler_id											INT,

										application_number							UUID UNIQUE,

										user_id 												INT NOT NULL,
										status_id 											INT NOT NULL,	


										CONSTRAINT ACCOUNT_CHANGE_REQUEST_PKEY PRIMARY KEY(account_change_request_id)	

										)	

										`

};