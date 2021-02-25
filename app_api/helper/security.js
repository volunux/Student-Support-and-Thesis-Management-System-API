module.exports = {

	'encryptor' : (req , res , token , uIdentity) => { let user_id = '' + uIdentity;

		let expiresIn = 60 * 60 * 24 * 7 * 1000;

		let options = {'maxAge' : expiresIn , 'httpOnly' : true };

			res.cookie('sid' , token , options);

			res.cookie('s_id' , user_id , options);

			let finalToken = { 'token' : token , 's_id' : user_id };

					res.status(200).json(finalToken);
	} ,

}