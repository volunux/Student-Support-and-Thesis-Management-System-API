module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS ATTACHMENT;
										CREATE TABLE IF NOT EXISTS ATTACHMENT (

										attachment_id 			SERIAL NOT NULL,
										location						VARCHAR(200) NOT NULL,
										mimetype 						VARCHAR(25) DEFAULT 'Not Available',
										size								VARCHAR(25) DEFAULT 'Not Available',
										key 								VARCHAR(200) NOT NULL,


										created_on 					DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 					DATE NOT NULL DEFAULT CURRENT_DATE,
										attachment_no 			INT UNIQUE NOT NULL,
										slug 								VARCHAR(30) UNIQUE NOT NULL,

										user_id 						INT NOT NULL,
										status_id						INT NOT NULL,	

										entry_id						INT,

										CONSTRAINT ATTACHMENT_PKEY PRIMARY KEY(attachment_id)	

										)	

										`

}