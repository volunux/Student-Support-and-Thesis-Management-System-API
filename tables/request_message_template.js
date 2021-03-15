module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS REQUEST_MESSAGE_TEMPLATE;
										CREATE TABLE IF NOT EXISTS REQUEST_MESSAGE_TEMPLATE (

										request_message_template_id 	SERIAL NOT NULL,
										title 												VARCHAR(200) NOT NULL,
										body 													VARCHAR(1000) NOT NULL,

										created_on 										DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 										DATE NOT NULL DEFAULT CURRENT_DATE,
										request_message_template_no		INT UNIQUE NOT NULL,
										slug 													VARCHAR(30) UNIQUE NOT NULL,

										user_id 											INT NOT NULL,
										status_id 										INT NOT NULL,	


										CONSTRAINT REQUEST_MESSAGE_TEMPLATE_PKEY PRIMARY KEY(request_message_template_id)	

										)	

										`

}