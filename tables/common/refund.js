module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS REFUND;
										CREATE TABLE IF NOT EXISTS REFUND (

										refund_id 											SERIAL NOT NULL,
										message 												VARCHAR(1000) NOT NULL,

										created_on 											DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 											DATE NOT NULL DEFAULT CURRENT_DATE,
										refund_no 											INT UNIQUE NOT NULL,
										slug 														VARCHAR(30) UNIQUE NOT NULL,

										letter_id												INT,
										stage_id												INT,

										handler_id											INT,

										application_number							UUID UNIQUE,

										faculty_id											INT NOT NULL,
										department_id										INT NOT NULL,

										user_id 												INT NOT NULL,
										status_id 											INT NOT NULL,	


										CONSTRAINT REFUND_PKEY PRIMARY KEY(refund_id)	

										)	

										`

}