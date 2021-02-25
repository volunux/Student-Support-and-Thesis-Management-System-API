module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS GENERAL_PAYMENT;
										CREATE TABLE IF NOT EXISTS GENERAL_PAYMENT (

										general_payment_id 	SERIAL NOT NULL,
										full_name 					VARCHAR(40) NOT NULL,
										email_address 			VARCHAR(40) NOT NULL,
										phone_number				VARCHAR(22) NOT NULL,

										payment_reference 	VARCHAR(40) NOT NULL,

										created_on 					DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 					DATE NOT NULL DEFAULT CURRENT_DATE,
										payment_no 					INT UNIQUE NOT NULL,
										slug 								VARCHAR(30) UNIQUE NOT NULL,

										payment_type_id			INT NOT NULL,
										payment_session_id	INT NOT NULL,

										department_id				INT NOT NULL,
										faculty_id					INT NOT NULL,

										user_id 						INT NOT NULL,
										status_id 					INT NOT NULL,	


										CONSTRAINT GENERAL_PAYMENT_PKEY PRIMARY KEY(general_payment_id)	

										)	

										`

}