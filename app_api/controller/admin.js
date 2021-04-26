module.exports = (opts) => {

	let db = require('../../database/db');

	let $rpd = require('../helper/responder');

	let async = require('async');

	let crypto = require('crypto');

	let query$ = require(`../queries/admin`);

	let mailMessage = require(`../mail/messages/user`);

	let mailer = require('../mail/sendgrid');

	let $user = require('../helper/user');

	return {

		'entries' : (req , res , next) => {

			let plan = query$.entries(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entries. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entries does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { return $rpd.handler(res , 200 , result.rows); }	});

		} ,

		'entryExists' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let $e = req.params.entry;

			let plan = query$.entryExists(req , res , {});

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result); }	});	}			

				else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryAdd' : (req , res , next) => {

				async.parallel({

				'Country' : (callback) => { db.query(query$.country$(req , res , {}) , [] , callback); } ,

				'Department' : (callback) => { db.query(query$.department$(req , res , {}) , [] , callback); } ,

				'Faculty' : (callback) => { db.query(query$.faculty$(req , res , {}) , [] , callback); } ,

				'Unit' : (callback) => { db.query(query$.unit$(req , res , {}) , [] , callback); } ,

				'Level' : (callback) => { db.query(query$.level$(req , res , {}) , [] , callback); } ,

				'Status' : (callback) => { db.query(query$.userStatus$(req , res , {}) , [] , callback) } ,

				'Role' : (callback) => { db.query(query$.role$(req , res , {}) , [] , callback) }

				} , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again`}); }

					if (!result) { return $rpd.handler(res , 400 , {'message' : `Data cannot be retrieved.`}); }

					if (result.Country && result.Country.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Country entries does not exists in the record or is not available.`}); }

					if (result.Department && result.Department.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Department entries does not exists in the record or is not available.`}); }

					if (result.Faculty && result.Faculty.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Faculty entries does not exists in the record or is not available.`}); }

					if (result.Unit && result.Unit.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unit entries does not exists in the record or is not available.`}); }

					if (result.Level && result.Level.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Level entries does not exists in the record or is not available.`}); }

					if (result.Status && result.Status.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `User Status entries does not exists in the record or is not available.`});	}

					if (result.Role && result.Role.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `User Role entries does not exists in the record or is not available.`});	}

					if (result) { let $r$b = {};

							$r$b['Country'] = result.Country.rows;

							$r$b['Department'] = result.Department.rows;

							$r$b['Faculty'] = result.Faculty.rows;

							$r$b['Unit'] = result.Unit.rows;

							$r$b['Level'] = result.Level.rows;

							$r$b['Status'] = result.Status.rows;

							$r$b['Role'] = result.Role.rows;

						return $rpd.handler(res , 200 , $r$b); } });

		} ,

		'entryAdd$' : (req , res , next) => {

			let b = req.body;

			let plan = query$.entryAdd$(req , res , {'$user' : $user});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to add or save ${opts.word} entry to record. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unable to add or save ${opts.word} entry to record. Please try again.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

		 				let $entry = {'title' : mailMessage.create2(req , res , next).title , 'message' : mailMessage.create2(req , res , next).message };

						let payload = {'user' : {'email_address' : b.email_address} , 'title' : $entry.title , 'message' : $entry.message };

						mailer.send(payload);

						return $rpd.handler(res , 200 , $result); }});

		} ,

		'entryDetail' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let plan = query$.entryDetail(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result ); } }); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryUpdate' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let plan = query$.entryUpdate(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

				async.parallel({

					'Country' : (callback) => { db.query(query$.country$(req , res , {}) , [] , callback); } ,

					'Department' : (callback) => { db.query(query$.department$(req , res , {}) , [] , callback); } ,

					'Faculty' : (callback) => { db.query(query$.faculty$(req , res , {}) , [] , callback); } ,

					'Unit' : (callback) => { db.query(query$.unit$(req , res , {}) , [] , callback); } ,

					'Level' : (callback) => { db.query(query$.level$(req , res , {}) , [] , callback); } ,

					'Status' : (callback) => { db.query(query$.userStatus$(req , res , {}) , [] , callback) } ,

					'Role' : (callback) => { db.query(query$.role$(req , res , {}) , [] , callback) }

				} , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve data. Please try again`}); }

					if (!result2) { return $rpd.handler(res , 400 , {'message' : `Data cannot be retrieved.`}); }

					if (result2.Country && result2.Country.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Country entries does not exists in the record or is not available.`}); }

					if (result2.Department && result2.Department.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Department entries does not exists in the record or is not available.`}); }

					if (result2.Faculty && result2.Faculty.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Faculty entries does not exists in the record or is not available.`}); }

					if (result2.Unit && result2.Unit.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Unit entries does not exists in the record or is not available.`}); }

					if (result2.Level && result2.Level.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `Level entries does not exists in the record or is not available.`}); }

					if (result2.Status && result2.Status.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `User Status entries does not exists in the record or is not available.`});	} 

					if (result2.Role && result2.Role.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `User Role entries does not exists in the record or is not available.`});	}

					if (result2) { let $r$b = {};

							$r$b['Country'] = result2.Country.rows;

							$r$b['Department'] = result2.Department.rows;

							$r$b['Faculty'] = result2.Faculty.rows;

							$r$b['Unit'] = result2.Unit.rows;

							$r$b['Level'] = result2.Level.rows;

							$r$b['Status'] = result2.Status.rows;

							$r$b['Role'] = result2.Role.rows;

							$r$b['Entry'] = $result;

								return $rpd.handler(res , 200 , $r$b); }	});	}	});	}

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryUpdate$' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let plan = query$.entryUpdate$(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to update ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 201 , $result ); } }); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`}); }

		} ,

		'entryDeactivate' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let plan = query$.entryDeactivate(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						if ($result.status != 'Active') {	return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

						return $rpd.handler(res , 200 , $result ); } }); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryDeactivate$' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let plan = query$.entryDeactivate$(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						if ($result.status != 'Active') {	return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

					let plan2 = query$.entryDeactivate$s(req , res , {});

					db.query(plan2 , [$e] , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

							return $rpd.handler(res , 201 , $result);	}	});	}	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryReactivate' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let plan = query$.entryReactivate(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						if ($result.status != 'Deactivated') { return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

						return $rpd.handler(res , 200 , $result); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryReactivate$' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let plan = query$.entryReactivate$(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						if ($result.status != 'Deactivated') { return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

					let plan2 = query$.entryReactivate$s(req , res , {});

					db.query(plan2 , [$e] , (err , result2) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result2.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result2.rowCount >= 1) { let $result2 = result2.rows[0];

							return $rpd.handler(res , 201 , $result);	}	});	}	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryDelete' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let plan = query$.entryDelete(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0];

						return $rpd.handler(res , 200 , $result ); } }); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryDelete$' : (req , res , next) => {

			if (req.params && req.params.entry) {

			let plan = query$.entryDelete$(req , res , {});

			let $e = req.params.entry;

			db.query(plan , [$e] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to delete ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { let $result = result.rows[0]

						return $rpd.handler(res , 204 , $result ); } }); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		} ,

		'entryDeleteMany$' : (req , res , next) => {

			let plan = query$.entryDeleteMany$(req , res , {});

	 		let b = req.body;

			if (b.entries && b.entries.length > 0) {

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to delete ${opts.word} entry or entries. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { return $rpd.handler(res , 204 , result.rows ); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `${opts.word} entries does not exists in the record or is not available.`}); }

		} ,

		'entryDeleteAll' : (req , res , next) => {

			let plan = query$.entryDeleteAll(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to delete ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry or entries does not exists in the record or is not available.`});	}

					if (result.rowCount >= 1) { return $rpd.handler(res , 200 , result.rows ); } });

		} ,

		'entryDeleteAll$' : (req , res , next) => {

			let plan = query$.entryDeleteAll$(req , res , {});

			db.query(plan , [] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to delete ${opts.word} entries. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entries does not exists in the record or is not available.`}); }

					if (result.rowCount >= 1) { return $rpd.handler(res , 200 , {'message' : `Entries successfully removed from the record.`} ); } });

		} ,

	}

}