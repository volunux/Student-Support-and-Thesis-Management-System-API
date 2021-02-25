let db = require('../../database/db');

let $rpd = require('./responder');

let query$ = require(`../queries/payment`);

module.exports = {

	'isPaymentRefunded' : (opts) => { return (req , res , next) => {

			if (req.params && req.params.payment && req.params.entry) {

			let plan = query$.isPaymentRefunded(req , res , {});

			let $e = req.params.entry;

			let $p = req.params.payment;

			db.query(plan , [$e , $p] , (err , result) => {

					if (err) { return $rpd.handler(res , 400 , {'message' : `Unable to retrieve ${opts.word} entry. Please try again.`}); }

					if (result.rowCount < 1) { return $rpd.handler(res , 404 , {'message' : `${opts.word} entry does not exists in the record or is not available.`});	}

					if (result.rowCount >= 1) { let $result = result.rows[0];

						if (req.user.role != 'departmentPresident') { return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

						if (req.user.role != 'facultyPresident') { return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

						if ($result.department != req.user.department && req.user.role == 'departmentPresident') { 

							return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

						if ($result.faculty != req.user.faculty && req.user.role == 'facultyPresident') { 

							return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

							if ($result.status == 'Refunded') { return $rpd.handler(res , 200 , {'message' : `${opts.word} entry cannot be refunded more than once.` }); } 

							return next(); }	}); }

			else { return $rpd.handler(res , 404 , {'message' : `No ${opts.word} id provided. Please provide a valid ${opts.word} id.`});	}

		}

		} ,

}