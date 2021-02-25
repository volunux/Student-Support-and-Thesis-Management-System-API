module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS PAYMENT_TYPE;
										CREATE TABLE IF NOT EXISTS PAYMENT_TYPE (

										payment_type_id 		SERIAL NOT NULL,
										name								VARCHAR(150) NOT NULL,
										abbreviation				VARCHAR(8) NOT NULL,
										description 				VARCHAR(250) DEFAULT 'Not Available',

										created_on 					DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 					DATE NOT NULL DEFAULT CURRENT_DATE,
										payment_type_no 		INT UNIQUE NOT NULL,
										slug 								VARCHAR(30) UNIQUE NOT NULL,

										user_id 						INT NOT NULL,
										status_id 					INT NOT NULL,	


										CONSTRAINT PAYMENT_TYPE_PKEY PRIMARY KEY(payment_type_id)	

										)	

										`

}