module.exports = {

	'handler' : (res , status , body) => {
			
			res.status(status);
			
			res.json(body);
	}

}