module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS ACCOUNT_CHANGE_MESSAGE_TEMPLATE_TYPE;
										CREATE TABLE IF NOT EXISTS ACCOUNT_CHANGE_MESSAGE_TEMPLATE_TYPE (

										account_change_message_template_type_id 	SERIAL NOT NULL,
										title 																		VARCHAR(200) NOT NULL,
										description 															VARCHAR(250) DEFAULT 'Not Available',

										created_on 																DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 																DATE NOT NULL DEFAULT CURRENT_DATE,
										account_change_message_template_type_no		INT UNIQUE NOT NULL,
										slug 																			VARCHAR(30) UNIQUE NOT NULL,

										user_id 																	INT NOT NULL,
										status_id 																INT NOT NULL,	


										CONSTRAINT ACCOUNT_CHANGE_MESSAGE_TEMPLATE_TYPE_PKEY PRIMARY KEY(account_change_message_template_type_id)	

										)	

										`

}