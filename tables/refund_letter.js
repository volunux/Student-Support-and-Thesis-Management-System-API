module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS REFUND_LETTER;
										CREATE TABLE IF NOT EXISTS REFUND_LETTER (

										refund_letter_id 								SERIAL NOT NULL,
										main_body 											VARCHAR(8000) NOT NULL,

										created_on 											DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 											DATE NOT NULL DEFAULT CURRENT_DATE,
										refund_letter_no 								INT UNIQUE NOT NULL,
										slug 														VARCHAR(30) UNIQUE NOT NULL,

										entry_id												INT NOT NULL,

										user_id 												INT NOT NULL,
										status_id 											INT NOT NULL,	


										CONSTRAINT REFUND_LETTER_PKEY PRIMARY KEY(refund_letter_id)	

										)	

										`

}