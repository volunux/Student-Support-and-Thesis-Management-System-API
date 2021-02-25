var $rpd = require('./responder');

module.exports = {

	'roleType' : (allowed) => {

		let isAllowed = (role) => { return allowed.indexOf(role) > -1;	}

		return (req , res , next) => {

				if (req.user && isAllowed(req.user.role)) { return next(); }

				else { return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}	}
		} ,

		'isUserPending' : (req , res , next) => {

			if (req.user && req.user.status && ['banned' , 'inactive' , 'pending'].indexOf(req.user.status) > 0	) {

					return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

				return next();
		} ,

		'isOk' : (req , res , next) => { return	$rpd.handler(res , 200 , {'message' : `Operation is permitted to students only.`}); } ,

		'isOkAdmin' : (req , res , next) => { return $rpd.handler(res , 200 , {'message' : `Operation is permitted to Administrators , Moderators , and other higher privileges only.`}); } ,

		'confirmAdmin' : (allowed) => { 

			let isAllowed = (role) => { return allowed.indexOf(role) > -1; }

			return (req , res , next) => {

				if (req.user && isAllowed(req.user.role)) { 

					return $rpd.handler(res , 200 , {'message' : `Operation is permitted to Administrators and Moderators only.`});	} 

				else { return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}	}
		} ,

		'isOwner' : (Model , ModelName , urlParam , unit) => { return (req , res , next) => { let entry = req.params['entry'];

				Model.findOne({'slug' : entry})
																				.lean({})

																				.select('requestType author department faculty unit -_id')

																				.exec((err , entryResult) => {

				if (req.user.unit != unit && req.user.role != 'student') {

						return $rpd.handler(res , 404, {'message' : `${ModelName} entry does not exists in the record or is not available.`}	);	}

				if (err) {

						return $rpd.handler(res , 400 , err);	}

				if (!entryResult) {

						return $rpd.handler(res , 404 , {'message' : `${ModelName} entry does not exists in the record or is not available.`}	);	}

				if (entryResult.author != req.user._id && req.user.role == 'student') {

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.department != req.user.department && req.user.role == 'hod') {

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.faculty != req.user.faculty && req.user.role == 'dean') {

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.unit != req.user.unit && req.user.unit != null) {

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}
																							
						return next();	});	}
		} ,

	'isOwner2' : function(Model , ModelName , urlParam) {

			return function(req , res , next) { let dataUrl = req.params[urlParam];

				Model.findOne({'slug' : dataUrl})
																						.lean({})

																						.exec((err , entryResult) => {
				
				if (err) {					return $rpd.handler(res , 400 , err);		}

				if (!entryResult) {	return $rpd.handler(res , 404 , {'message' : `${ModelName} entry does not exists in the record or is not available.`}	);		}

				if (entryResult.author != req.user._id && (req.user.role == 'student')) {	return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}
																						
																																												return next();		})	}
	} ,

		'$isOwner' : (req , res , next , entryResult , entryType , tHappen , normalPrivilege , superPrivilege , callback , leastPrivilege) => {

			let author = typeof entryResult.author == 'string' ? entryResult.author : entryResult.author instanceof Object && entryResult.author._id ? entryResult.author._id : "5fb2d2f175f95a570adfa1d6";

				if (req.user.unit != entryResult.unit && normalPrivilege.indexOf(req.user.role) < 0 && superPrivilege.indexOf(req.user.role) < 0) { if (tHappen) tHappen.run = false;

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}	);	}

				if (author != req.user._id && normalPrivilege.indexOf(req.user.role) > -1) { if (tHappen) tHappen.run = false;

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.department != req.user.department && (leastPrivilege.indexOf(req.user.role) + 1) == 1) { if (tHappen) tHappen.run = false;

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.faculty != req.user.faculty &&  (leastPrivilege.indexOf(req.user.role) + 1) == 2) { if (tHappen) tHappen.run = false;

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.unit != req.user.unit && req.user.unit != null && superPrivilege.indexOf(req.user.role) < 0) { if (tHappen) tHappen.run = false;

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (callback && !tHappen) { return callback(req , res , next , entryResult); }
		} ,

		'$isOwnerGR' : (req , res , next , eResult , tHappen , nPrivilege , sPrivilege , cb , lPrivilege , ed) => {

			let author = typeof eResult.author == 'string' || typeof eResult.author == 'number' ? eResult.author : eResult.author instanceof Object && eResult.author._id ? eResult.author._id : 78788;

				if (req.user.unit != eResult.unit && nPrivilege.indexOf(req.user.role) < 0 && sPrivilege.indexOf(req.user.role) < 0) {

					if (tHappen) { tHappen.run = false; }

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}	); }

				if (author != req.user._id && nPrivilege.indexOf(req.user.role) > -1) {

					if (tHappen) { tHappen.run = false; }

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

				if (eResult.department != req.user.department && lPrivilege.indexOf(req.user.role) == 0) {

					if (tHappen) { tHappen.run = false; }

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

				if (eResult.faculty != req.user.faculty &&  lPrivilege.indexOf(req.user.role) == 1) { 

					if (tHappen) { tHappen.run = false; }

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

				if (nPrivilege.indexOf(req.user.role) < 0 && eResult.unit != req.user.unit && req.user.unit != null && sPrivilege.indexOf(req.user.role) < 0) {

					if (tHappen) { tHappen.run = false; }

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }


				if (ed && Object.keys(ed).length > 0) {

					if (eResult.unit != req.user.unit && ed.leastPrivilege.indexOf(req.user.role) > -1) { 

						if (tHappen) { tHappen.run = false; }

							return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

					if (ed && ed.roles.indexOf(req.user.role) < 0) {

						if (tHappen) { tHappen.run = false; }

							return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); } }

				if (cb && !tHappen) { return cb(req , res , next , eResult); }
		} ,

		'$checkUnit' : (req , res , next , eResult , tHappen , nPrivilege , sPrivilege , cb , lPrivilege , ed) => {

				if (req.user.unit != eResult.unit && nPrivilege.indexOf(req.user.role) < 0 && sPrivilege.indexOf(req.user.role) < 0) {

					if (tHappen) { tHappen.run = false; }

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}	); }

				if (cb && !tHappen) { return cb(req , res , next , eResult); }
		} ,

		'$isOwnerUpdate' : (req , res , next , entryResult , entryType , tHappen , normalPrivilege , superPrivilege , callback , leastPrivilege) => {

			let author = typeof entryResult.author == 'string' ? entryResult.author : entryResult.author instanceof Object && entryResult.author._id ? entryResult.author._id : "5fb2d2f175f95a570adfa1d6";

				if (req.user.unit != entryResult.unit && normalPrivilege.indexOf(req.user.role) < 0 && superPrivilege.indexOf(req.user.role) < 0) { if (tHappen) tHappen.run = false;

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}	);	}

				if (author != req.user._id && normalPrivilege.indexOf(req.user.role) > -1) { if (tHappen) tHappen.run = false;

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.department != req.user.department && (leastPrivilege.indexOf(req.user.role) + 1) == 1) { if (tHappen) tHappen.run = false;

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.faculty != req.user.faculty && (leastPrivilege.indexOf(req.user.role) + 1) == 2) { if (tHappen) tHappen.run = false;

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.unit != req.user.unit && req.user.unit != null && superPrivilege.indexOf(req.user.role) < 0) { if (tHappen) tHappen.run = false;

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (callback && !tHappen) { return callback(req , res , next , entryResult); }
		} ,

		'$isOwnerRefund' : (req , res , next , eResult , tHappen , nPrivilege , sPrivilege , lPrivilege , cb) => {

			let author = typeof eResult.author == 'number' || typeof eResult.author == 'string' ? eResult.author : eResult.author instanceof Object && eResult.author._id ? eResult.author._id : 28218;

				if (author != req.user._id && nPrivilege.indexOf(req.user.role) > -1) {

						if (tHappen) { tHappen.run = false; }

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

				if (eResult.department != req.user.department && lPrivilege.indexOf(req.user.role) == 0) { 

						if (tHappen) { tHappen.run = false; }

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

				if (eResult.faculty != req.user.faculty && lPrivilege.indexOf(req.user.role) == 1) {

						if (tHappen) { tHappen.run = false; }

						return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

				if (cb && !tHappen) { return cb(req , res , next , eResult); }
		} ,

		'$isOwnerPayment' : (req , res , next , eResult , tHappen , nPrivilege , lPrivilege , cb) => {

			let author = typeof eResult.author == 'number' || typeof eResult.author == 'string' ? eResult.author : eResult.author instanceof Object && eResult.author._id ? eResult.author._id : 78218;

				if (author != req.user._id && nPrivilege.indexOf(req.user.role) > -1 && nPrivilege.indexOf(req.user.role) < 1) {	

					return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

				if (eResult.department != req.user.department && nPrivilege.indexOf(req.user.role) > 0 && nPrivilege.indexOf(req.user.role) < 2) {	

					return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

				if (eResult.faculty != req.user.faculty && nPrivilege.indexOf(req.user.role) > 1) {

					return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

				if (eResult.department != req.user.department && lPrivilege.indexOf(req.user.role) == 1) {	

					return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

				if (eResult.faculty != req.user.faculty && lPrivilege.indexOf(req.user.role) == 2) {

					return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

				if (cb) { return cb(req , res , next , eResult); }
		} ,

		'$isOwnerGeneral' : (req , res , next , entryResult , callback) => {

			if (entryResult.author._id != req.user._id && req.user.role == 'student') { return $rpd.handler(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (callback) { return callback(req , res , next , entryResult); }
		} ,

		'successReponse' : (req , res , next , entryResult) => {
					
				return $rpd.handler(res , 200 , entryResult);
		} ,

		'errorResponse' : (req , res , next , err) => {

				return $rpd.handler(res , 400 , err);
		} ,
	
}