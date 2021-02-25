let myCookies = {} , $rpd = require('./responder');


const expiresIn = 60 * 60 * 24 * 7 * 1000;

const options = {'maxAge' : expiresIn , 'httpOnly' : true };

module.exports = {

		'setCookie' : (res , token) => {	let hCookie = token.token , uIdentity = token.s_id;

																						res.cookie('sid' , hCookie , options);

																						res.cookie('s_id' , uIdentity , options);
		} ,

		'decryptor' : (req , res , next) => {

				myCookies = req.cookies.sid && req.cookies.s_id ? req.cookies.sid : req.headers.Authorization;
					
					if (!myCookies) { return $rpd.handler(res , 401 , {'message' : 'Access Denied'}); }

							req.headers.Authorization = myCookies;

								return next();			
		}

}