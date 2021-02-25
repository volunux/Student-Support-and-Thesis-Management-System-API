let crypto = require('crypto-random-string');

class AttachmentRepository {

	entries(req , res , opts) {

		let b = req.body;

		let query = `SELECT atth.attachment_id AS _id , atth.attachment_no AS num , atth.entry_id , atth.updated_on , s.word AS status ,

									(SELECT row_to_json(u)

										FROM (SELECT u.user_id AS _id , u.first_name || ' ' || u.last_name AS full_name 

											FROM USERS AS u 

											WHERE u.user_id = atth.user_id) AS u ) AS author

									FROM ATTACHMENT AS atth

									INNER JOIN STATUS AS s ON s.status_id = atth.status_id

									ORDER BY atth.updated_on DESC

									LIMIT ${opts.$l}`;

		return query;

	} 

	entryAdd$(req , res , opts) {

		let b = req.body;

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

		let query = `INSERT INTO ATTACHMENT (`;

		query += b.key ? `key , ` : '';

		query += b.location ? `location , ` : '';

		query += b.size ? `size , ` : '';

		query += b.mimetype ? `mimetype , ` : '';

		query += `attachment_no , slug , user_id , status_id ) `;

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

									FROM ATTACHMENT AS atth

									WHERE atth.key = $1

									RETURNING atth.key`;

		return query;

	}

	entryDeleteMany$(req , res , opts) {

 		let b = req.body;

 		let $es = b.entries && b.entries.length ? b.entries : [];

 		let et = $es.map((item) => { return `$$${item}$$`; }).join(' , ');

		let query = `DELETE

									FROM ATTACHMENT AS atth

									WHERE attachment_no IN (${et})

									RETURNING key`;

		return query;

	}

	entryDeleteAll(req , res , opts) {

		let query = `SELECT atth.slug

									FROM ATTACHMENT AS atth

									WHERE atth.slug

									LIMIT 1

								`;

		return query;

	} 

	entryDeleteAll$(req , res , opts) {

		let query = `DELETE FROM ATTACHMENT
								
								`;

		return query;

	} 

}

module.exports = {

	AttachmentRepository : AttachmentRepository

}