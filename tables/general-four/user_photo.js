module.exports = {

	'CREATE_TABLE' : `
										DROP TABLE IF EXISTS USER_PHOTO;
										CREATE TABLE IF NOT EXISTS USER_PHOTO (

										user_photo_id 			SERIAL NOT NULL,
										location						VARCHAR(200) NOT NULL,
										mimetype 						VARCHAR(25) DEFAULT 'Not Available',
										size								VARCHAR(25) DEFAULT 'Not Available',
										key 								VARCHAR(200) NOT NULL,


										created_on 					DATE NOT NULL DEFAULT CURRENT_DATE,
										updated_on 					DATE NOT NULL DEFAULT CURRENT_DATE,
										user_photo_no 			INT UNIQUE NOT NULL,
										slug 								VARCHAR(30) UNIQUE NOT NULL,

										user_id 						INT UNIQUE NOT NULL,
										status_id						INT NOT NULL,

										CONSTRAINT USER_PHOTO_PKEY PRIMARY KEY(user_photo_id)	

										)	

										`

}