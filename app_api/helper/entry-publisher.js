let $rpd = require('../helper/responder');

module.exports = {

	'isOk' : (req , res , next) => {

		return $rpd.handler(res , 200 , {'message' : `Operation is permitted to students only.`});	

	} ,

	'user' : (req , res , next) => {

		req.body.author = req.user._id;
																				
			return next(); 

	} ,

}