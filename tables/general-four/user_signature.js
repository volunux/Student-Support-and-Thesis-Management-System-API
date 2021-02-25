module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS USER_SIGNATURE;
										CREATE TABLE IF NOT EXISTS USER_SIGNATURE (

										user_signature_id 	SERIAL NOT NULL,
										location						VARCHAR(200) NOT NULL,
										mimetype 						VARCHAR(25) DEFAULT 'Not Available',
										size								VARCHAR(25) DEFAULT 'Not Available',
										key 								VARCHAR(200) NOT NULL,


										created_on 					DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 					DATE NOT NULL DEFAULT CURRENT_DATE,
										user_signature_no 	INT UNIQUE NOT NULL,
										slug 								VARCHAR(30) UNIQUE NOT NULL,

										user_id 						INT UNIQUE NOT NULL,
										status_id						INT NOT NULL,

										CONSTRAINT USER_SIGNATURE_PKEY PRIMARY KEY(user_signature_id)	

										)	

										`

}