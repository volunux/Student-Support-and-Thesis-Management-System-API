module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS REFUND_SIGNATURE;
										CREATE TABLE IF NOT EXISTS REFUND_SIGNATURE (

										refund_signature_id 						SERIAL NOT NULL,

										created_on 											DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 											DATE NOT NULL DEFAULT CURRENT_DATE,
										refund_signature_no 						INT UNIQUE NOT NULL,
										slug 														VARCHAR(30) UNIQUE NOT NULL,

										entry_id												INT NOT NULL,

										user_id 												INT NOT NULL,
										status_id 											INT NOT NULL,


										CONSTRAINT REFUND_SIGNATURE_PKEY PRIMARY KEY(refund_signature_id)	

										)	

										`

}