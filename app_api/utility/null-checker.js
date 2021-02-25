module.exports = {

	'general' : (req , res , next) => {

		let keys = ['description'];

		let b = req.body;

		for (let i of keys) {

			if (!b[i]) { b[i] = '';	}	}

		return b;

	}

}