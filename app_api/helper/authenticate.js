let jwt = require('jsonwebtoken') , $rpd = require('./responder');

module.exports = {

		'auth' : (req , res , next) => { 

			if (req.headers && req.headers.authorization) {

			let token = req.headers.authorization.split(' ')[1];

			if(token == null) { return $rpd.handler(res , 401 , {'message' : 'Access Denied'}); }

				jwt.verify(token , process.env.JWT_SECRET , (err , decoded) => {

			if (err) { return $rpd.handler(res , 401 , {'message' : 'Invalid Token'}); }
		
			else { let verified = decoded;

					req.user = verified;

					console.log(req.user);
								
					return next(); }	}); }

				else { return $rpd.handler(res , 401 , {'message' : 'Access Denied'}); }
		} ,

		'confirmUserStatus' : (req , res , next) => {

			if (req.user.status == 'pending') {

				return $rpd.handler(res , 200 , {'message' : `Account status is in pending state and a user cannot perform any important tasks function until the account is fully approved.`}); }

				return next();
		} ,

		'authCook' : (req , res , next) => { let token = req.cookies.sid;

			if(token == null) { return $rpd.handler(res , 401 , {'message' : 'Access Denied'});	}

				jwt.verify(token , process.env.JWT_SECRET , (err , decoded) => {
					
			if (err) { return $rpd.handler(res , 401 , {'message' : 'Invalid Token'}); }
		
			else { let verified = decoded;

				req.user = verified;
								
				return next(); } });	
		} ,

		'fAuth' : (req , res , next) => { let token = req.cookies.sid || req.cookies.s_id;

				if(!token) {	return res.redirect('/signin');	}

						return next();
		} ,

};