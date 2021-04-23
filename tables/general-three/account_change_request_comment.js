module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS ACCOUNT_CHANGE_REQUEST_COMMENT;
										CREATE TABLE IF NOT EXISTS ACCOUNT_CHANGE_REQUEST_COMMENT (

										account_change_request_comment_id SERIAL NOT NULL,
										text 															VARCHAR(500) NOT NULL,


										created_on 											DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 											DATE NOT NULL DEFAULT CURRENT_DATE,
										account_change_request_comment_no 	INT UNIQUE NOT NULL,
										slug 														VARCHAR(30) UNIQUE NOT NULL,

										entry_id												INT NOT NULL,
										user_id 												INT NOT NULL,

										status_id 											INT NOT NULL,


										CONSTRAINT ACCOUNT_CHANGE_REQUEST_COMMENT_PKEY PRIMARY KEY(account_change_request_comment_id)	

										)	

										`

}