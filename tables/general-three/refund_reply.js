module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS REFUND_REPLY;
										CREATE TABLE IF NOT EXISTS REFUND_REPLY (

										reply_id 												SERIAL NOT NULL,
										text 														VARCHAR(500) NOT NULL,

										comment_author_name							VARCHAR(150) NOT NULL,

										created_on 											DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 											DATE NOT NULL DEFAULT CURRENT_DATE,
										reply_no 												INT UNIQUE NOT NULL,
										slug 														VARCHAR(30) UNIQUE NOT NULL,


										comment_id											INT NOT NULL,
										entry_id												INT NOT NULL,
										user_id 												INT NOT NULL,

										status_id 											INT NOT NULL,


										CONSTRAINT REFUND_REPLY_PKEY PRIMARY KEY(reply_id)	

										)	

										`

}