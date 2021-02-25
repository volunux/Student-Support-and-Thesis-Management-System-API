module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS PAYMENT_SESSION;
										CREATE TABLE IF NOT EXISTS PAYMENT_SESSION (

										payment_session_id		SERIAL NOT NULL,
										name									VARCHAR(150) NOT NULL,
										amount								INT NOT NULL,

										created_on						DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on						DATE NOT NULL DEFAULT CURRENT_DATE,
										payment_session_no 		INT UNIQUE NOT NULL,
										slug									VARCHAR(30) UNIQUE NOT NULL,

										payment_type_id				INT NOT NULL,
										user_id								INT NOT NULL,
										status_id 						INT NOT NULL,

										CONSTRAINT PAYMENT_SESSION_PKEY PRIMARY KEY(payment_session_id)	)	

										`

}