let validationMessage = require('./message/list');

module.exports = {

	'build' : (req , res , err , msgList) => {

			let $l = [];

			if (err && err.error && err.error.details) { 

			let $details = err.error.details;

			let itemAdded = false;

			for (let i in $details) { let $e = $details[i];

				$l[i] = {};

				let type = $e.type.split('.');

				if (type[0] == 'array') {

					if (itemAdded == false) {

						itemAdded = true;

						$l[i]['message'] = $e.context.label + ' ' + validationMessage[msgList][$e.path[0]][type[0]][type[1]];
						$l[i]['path'] = $e.context.label;

					} }

				else {

				$l[i]['message'] = $e.context.label + ' ' + validationMessage[msgList][$e.context.key][type[0]][type[1]];
				$l[i]['path'] = $e.context.label;

						}
			}	}

			return $l;
	}

}