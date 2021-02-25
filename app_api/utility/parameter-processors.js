module.exports = {

	'string' : (req , res , next) => {

		if (req.params && req.params.entry) {

			const $p = req.params.entry;

			const $e = typeof $p == 'string' ? $p : 'abcdefghijkl';

			req.params.entry = $e;

			return next();

		}

	}

};