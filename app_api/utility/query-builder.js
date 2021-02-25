let queryBuilderTable = require('./query-builder-table');

function typeVerifyer(val) {

	return '$$' + val + '$$';

}

module.exports = {

	'update$' : (body , table) => {

		let queryBuilder = [];

		let $map = queryBuilderTable[table]();

			for (let i of Object.keys(body)) {

			if (body[i]) {

				let subQueryBuilder = [];

				subQueryBuilder.push($map.get(i) + ' = ' +  typeVerifyer(body[i]));

				queryBuilder.push(subQueryBuilder.join(''));

				subQueryBuilder = [];	}	}

				return queryBuilder.join(' , ');

	} ,

	'documentRF$' : (req , res , opts) => {

		let b = req.body;

		let docs = null;

    let attachment$ = [];

		let query = `INSERT INTO ATTACHMENT (`;

		query += b.documents[0].filename ? `filename , ` : '';

		query += b.documents[0].key ? `key , ` : '';

		query += b.documents[0].location ? `location , ` : '';

		query += b.documents[0].size ? `size , ` : '';

		query += b.documents[0].encoding ? `encoding , ` : '';

		query += b.documents[0].mimetype ? `mimetype , ` : '';

		query += `attachment_no , slug , entry_id , user_id , status_id) `;


		if (b.documents && b.documents.length > 0) {

			docs = b.documents;

			for (let i in docs) {

					let c = +(opts.c({'length' : 9 , 'type' : 'numeric'}));

					let s = (opts.c({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

				if (attachment$.length < 1) { query += ` VALUES `; }

				let $sub = `( `;

				$sub += docs[i].filename ? `$$${docs[i].filename}$$ , ` : '';

				$sub += docs[i].key ? `$$${docs[i].key}$$ , ` : '';

				$sub += docs[i].location ? `$$${docs[i].location}$$ , ` : '';

				$sub += docs[i].size ? `$$${docs[i].size}$$ , ` : '';

				$sub += docs[i].encoding ? `$$${docs[i].encoding}$$ , ` : '';

				$sub += docs[i].mimetype ? `$$${docs[i].mimetype}$$ , ` : '';

					attachment$.push(` ${$sub} $$${c}$$ , $$${s}$$ , $$${opts.entry._id}$$ , $$${b.author}$$ ,

													(SELECT status_id AS _id FROM STATUS AS s WHERE s.word = 'Active' LIMIT 1) ) `);

					if (i != docs.length -1) attachment$.push(` , `);

			} }
	
			let $att = attachment$.join(' ');

			query += $att;

			query += ` RETURNING location , size , key`;

			return query;

	} ,

	'documentGR$' : (req , res , opts) => {

		let b = req.body;

		let docs = null;

    let attachment$ = [];

		let query = `INSERT INTO ATTACHMENT (`;

		query += b.documents[0].filename ? `filename , ` : '';

		query += b.documents[0].key ? `key , ` : '';

		query += b.documents[0].location ? `location , ` : '';

		query += b.documents[0].size ? `size , ` : '';

		query += b.documents[0].encoding ? `encoding , ` : '';

		query += b.documents[0].mimetype ? `mimetype , ` : '';

		query += `attachment_no , slug , entry_id , user_id , status_id) `;


		if (b.documents && b.documents.length > 0) {

			docs = b.documents;

			for (let i in docs) {

					let c = +(opts.c({'length' : 9 , 'type' : 'numeric'}));

					let s = (opts.c({'length' : 29 , 'type' : 'alphanumeric'})).toLowerCase();

				if (attachment$.length < 1) { query += ` VALUES `; }

				let $sub = `( `;

				$sub += docs[i].filename ? `$$${docs[i].filename}$$ , ` : '';

				$sub += docs[i].key ? `$$${docs[i].key}$$ , ` : '';

				$sub += docs[i].location ? `$$${docs[i].location}$$ , ` : '';

				$sub += docs[i].size ? `$$${docs[i].size}$$ , ` : '';

				$sub += docs[i].encoding ? `$$${docs[i].encoding}$$ , ` : '';

				$sub += docs[i].mimetype ? `$$${docs[i].mimetype}$$ , ` : '';

					attachment$.push(` ${$sub} $$${c}$$ , $$${s}$$ , $$${opts.entry._id}$$ , $$${b.author}$$ ,

													(SELECT status_id AS _id FROM STATUS AS s WHERE s.word = 'Active' LIMIT 1) ) `);

					if (i != docs.length -1) attachment$.push(` , `);

			} }
	
			let $att = attachment$.join(' ');

			query += $att;

			query += ` RETURNING location , size , key`;

			return query;

	} ,

	'userPhoto' : (req , res , opts) => {

		let b = req.body;

		let query = `INSERT INTO USER_PHOTO (`;

		query += b.key ? `key , ` : '';

		query += b.location ? `location , ` : '';

		query += b.size ? `size , ` : '';

		query += b.mimetype ? `mimetype , ` : '';

		query += `user_photo_no , slug , user_id , status_id) `;

		query += `VALUES(`;

		query += b.key ? `$$${b.key}$$ , ` : '';

		query += b.location ? `$$${b.location}$$ , ` : '';

		query += b.size ? `$$${b.size}$$ , ` : '';

		query += b.mimetype ? `$$${b.mimetype}$$ , ` : '';

		query += `$$${opts.c}$$ , $$${opts.s}$$ , $$${opts._id}$$`;

		query += ` , (SELECT status_id AS _id FROM STATUS AS s WHERE s.word = 'Active' LIMIT 1) ) `;

			return query;
	} ,

	'userSignature' : (req , res , opts) => {

		let b = req.body;

		let query = `INSERT INTO USER_SIGNATURE (`;

		query += b.key ? `key , ` : '';

		query += b.location ? `location , ` : '';

		query += b.size ? `size , ` : '';

		query += b.mimetype ? `mimetype , ` : '';

		query += `user_signature_no , slug , user_id , status_id) `;

		query += `VALUES(`;

		query += b.key ? `$$${b.key}$$ , ` : '';

		query += b.location ? `$$${b.location}$$ , ` : '';

		query += b.size ? `$$${b.size}$$ , ` : '';

		query += b.mimetype ? `$$${b.mimetype}$$ , ` : '';

		query += `$$${opts.c}$$ , $$${opts.s}$$ , $$${opts._id}$$`;

		query += ` , (SELECT status_id AS _id FROM STATUS AS s WHERE s.word = 'Active' LIMIT 1) ) `;

			return query;
	}

}