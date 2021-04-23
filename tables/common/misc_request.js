module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS MISC_REQUEST;
										CREATE TABLE IF NOT EXISTS MISC_REQUEST (

										misc_request_id 								SERIAL NOT NULL,
										title														VARCHAR(150) NOT NULL,
										message 												VARCHAR(1000) NOT NULL,

										created_on 											DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 											DATE NOT NULL DEFAULT CURRENT_DATE,
										misc_request_no									INT UNIQUE NOT NULL,
										slug 														VARCHAR(30) UNIQUE NOT NULL,

										handler_id											INT,

										user_id 												INT NOT NULL,
										status_id 											INT NOT NULL,	


										CONSTRAINT MISC_REQUEST_PKEY PRIMARY KEY(misc_request_id)	

										)	

										`

};