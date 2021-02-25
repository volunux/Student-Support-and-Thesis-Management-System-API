module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS REFUND_STAGE;
										CREATE TABLE IF NOT EXISTS REFUND_STAGE (

										refund_stage_id 		SERIAL NOT NULL,
										name								VARCHAR(150) NOT NULL,
										description 				VARCHAR(250) DEFAULT 'Not Available',


										created_on 					DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 					DATE NOT NULL DEFAULT CURRENT_DATE,
										refund_stage_no		 	INT UNIQUE NOT NULL,
										slug 								VARCHAR(30) UNIQUE NOT NULL,

										user_id 						INT NOT NULL,
										status_id 					INT NOT NULL,


										CONSTRAINT REFUND_STAGE_PKEY PRIMARY KEY(refund_stage_id)	

										)	

										`

}