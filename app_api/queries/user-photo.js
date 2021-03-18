let crypto = require('crypto-random-string');

class UserPhotoRepository {

	entries(req , res , opts) {

		let b = req.body;

		let p = +(q.page) > 0 ? (+(q.page) - 1) * 10 : 0;

		let query = `SELECT upho.user_photo_id AS _id , upho.user_photo_no AS num , upho.updated_on , s.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name 

											FROM USERS AS u 

											WHERE u.user_id = upho.user_id) AS u ) AS author

									FROM USER_PHOTO AS upho

									INNER JOIN STATUS AS s ON s.status_id = upho.status_id

									ORDER BY upho.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;

	} 

	entryAdd$(req , res , opts) {

		let b = req.body;

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let query = `INSERT INTO USER_PHOTO (`;

		query += b.key ? `key , ` : '';

		query += b.location ? `location , ` : '';

		query += b.size ? `size , ` : '';

		query += b.mimetype ? `mimetype , ` : '';

		query += `user_photo_no , slug , user_id , status_id ) `;

		query += ` VALUES (`;

		query += b.key ? `$$${b.key}$$ , ` : '';

		query += b.location ? `$$${b.location}$$ , ` : '';

		query += b.size ? `$$${b.size}$$ , ` : '';

		query += b.mimetype ? `$$${b.mimetype}$$ , ` : '';

		query += ` $$${c}$$ , $$${s}$$ , $$${b.author}$$ , (SELECT status_id AS _id FROM STATUS AS gs WHERE gs.word = 'Active' LIMIT 1) ) 

		RETURNING location , key , size`;

			return query;

	}

	entryDelete$(req , res , opts) {

		let query = `DELETE

									FROM USER_PHOTO AS upho

									WHERE upho.key = $1

									RETURNING upho.key`;

		return query;

	}

	entryDeleteMany$(req , res , opts) {

 		let b = req.body;

 		let $es = b.entries && b.entries.length ? b.entries : [];

 		let et = $es.map((item) => { return `$$${item}$$`; }).join(' , ');

		let query = `DELETE

									FROM USER_PHOTO AS upho

									WHERE user_photo_no IN (${et})

									RETURNING key`;

		return query;

	}

	entryDeleteAll(req , res , opts) {

		let query = `SELECT upho.slug

									FROM USER_PHOTO AS upho

									WHERE upho.slug

									LIMIT 1

								`;

		return query;

	} 

	entryDeleteAll$(req , res , opts) {

		let query = `DELETE FROM USER_PHOTO
								
								`;

		return query;

	} 

}

module.exports = {

	UserPhotoRepository : UserPhotoRepository

}