let crypto = require('crypto-random-string');

class UserSignatureRepository {

	entries(req , res , opts) {

		let b = req.body;

		let p = +(q.page) > 0 ? (+(q.page) - 1) * 10 : 0;

		let query = `SELECT usig.user_signature_id AS _id , usig.user_signature_no AS num , usig.updated_on , s.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name 

											FROM USERS AS u 

											WHERE u.user_id = usig.user_id) AS u ) AS author

									FROM USER_SIGNATURE AS usig

									INNER JOIN STATUS AS s ON s.status_id = usig.status_id

									ORDER BY usig.updated_on DESC

									LIMIT 11 OFFSET ${p}

									`;

		return query;

	} 

	entryAdd$(req , res , opts) {

		let b = req.body;

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let query = `INSERT INTO USER_SIGNATURE (`;

		query += b.key ? `key , ` : '';

		query += b.location ? `location , ` : '';

		query += b.size ? `size , ` : '';

		query += b.mimetype ? `mimetype , ` : '';

		query += `user_signature_no , slug , user_id , status_id ) `;

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

									FROM USER_SIGNATURE AS usig

									WHERE usig.key = $1

									RETURNING usig.key

									`;

		return query;

	}

	entryDeleteMany$(req , res , opts) {

 		let b = req.body;

 		let $es = b.entries && b.entries.length ? b.entries : [];

 		let et = $es.map((item) => { return `$$${item}$$`; }).join(' , ');

		let query = `DELETE

									FROM USER_SIGNATURE AS usig

									WHERE user_signature_no IN (${et})

									RETURNING key

									`;

		return query;

	}

	entryDeleteAll(req , res , opts) {

		let query = `SELECT usig.slug

									FROM USER_SIGNATURE AS usig

									WHERE usig.slug

									LIMIT 1

								`;

		return query;

	} 

	entryDeleteAll$(req , res , opts) {

		let query = `DELETE FROM USER_SIGNATURE
								
								`;

		return query;

	} 

}

module.exports = {

	UserSignatureRepository : UserSignatureRepository

}