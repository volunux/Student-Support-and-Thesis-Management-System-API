let crypto = require('crypto-random-string');

class UserPhotoRepository {

	entries(req , res , opts) {

		let b = req.body;

		let query = `SELECT at.attachment_id AS _id , at.attachment_no AS num , at.entry_id , at.updated_on , s.word AS status

									FROM ATTACHMENT AS at

									INNER JOIN STATUS AS s ON s.status_id = at.status_id

									ORDER BY at.updated_on DESC

									LIMIT ${opts.$l}`;

		return query;

	} 

	entryAdd$(req , res , opts) {

		let b = req.body;

    let attachment$ = [];

		let query = `INSERT INTO ATTACHMENT (key , location , size , mimetype , attachment_no , slug , user_id , status_id)`;

		let c = +(crypto({'length' : 9 , 'type' : 'numeric'}));

		let s = (crypto({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

			if (attachment$.length < 1) query += ` VALUES `;

			attachment$.push(` ($$${b.key}$$ , $$${b.location}$$ , $$${b.size}$$ , $$${b.mimetype}$$ , $$${c}$$ , $$${s}$$ , $$${b.author}$$ ,

													(SELECT status_id AS _id FROM STATUS AS s WHERE s.word = 'Active' LIMIT 1)) `);
	
		let $att = attachment$.join(' ');

		query += $att;

		query += ` RETURNING location , size , key`;

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

									FROM ATTACHMENT AS at

									WHERE attachment_no IN (${et})

									RETURNING key`;

		return query;

	}

	entryDeleteAll(req , res , opts) {

		let query = `SELECT at.slug

									FROM ATTACHMENT AS at

									WHERE at.slug

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

	UserPhotoRepository : UserPhotoRepository

}