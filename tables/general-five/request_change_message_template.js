module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS REQUEST_CHANGE_MESSAGE_TEMPLATE;
										CREATE TABLE IF NOT EXISTS REQUEST_CHANGE_MESSAGE_TEMPLATE (

										rcmt_id 											SERIAL NOT NULL,
										title 												VARCHAR(150) NOT NULL,
										body 													VARCHAR(1000) NOT NULL,

										created_on 										DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 										DATE NOT NULL DEFAULT CURRENT_DATE,
										request_change_message_template_no		INT UNIQUE NOT NULL,
										slug 													VARCHAR(30) UNIQUE NOT NULL,

										request_change_message_template_type_id 	SERIAL NOT NULL,
										user_id 											INT NOT NULL,
										status_id 										INT NOT NULL,	


										CONSTRAINT REQUEST_CHANGE_MESSAGE_TEMPLATE_PKEY PRIMARY KEY(rcmt_id)

										)	

										`

}