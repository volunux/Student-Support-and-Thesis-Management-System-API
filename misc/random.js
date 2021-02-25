const crypto = require('crypto-random-string');

module.exports = {

	'random' : () => {

		console.log(crypto({'length' : 30 , 'type' : 'alphanumeric'}));
	}
}