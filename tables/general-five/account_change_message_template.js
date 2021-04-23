module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS ACCOUNT_CHANGE_MESSAGE_TEMPLATE;
										CREATE TABLE IF NOT EXISTS ACCOUNT_CHANGE_MESSAGE_TEMPLATE (

										account_change_message_template_id 	SERIAL NOT NULL,
										title 															VARCHAR(200) NOT NULL,
										body 																VARCHAR(1500) DEFAULT 'Not Available',

										created_on 													DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 													DATE NOT NULL DEFAULT CURRENT_DATE,
										account_change_message_template_no	INT UNIQUE NOT NULL,
										slug 																VARCHAR(30) UNIQUE NOT NULL,

										account_change_message_template_type_id INT NOT NULL,

										user_id 														INT NOT NULL,
										status_id 													INT NOT NULL,	


										CONSTRAINT ACCOUNT_CHANGE_MESSAGE_TEMPLATE_PKEY PRIMARY KEY(account_change_message_template_id)	

										)	

										`

}