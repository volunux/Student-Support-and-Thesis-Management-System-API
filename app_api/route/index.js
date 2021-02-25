let express = require('express');

let router = express.Router();

let qType = require('../helper/query-type');

let opts = {

	'first' : 'User' ,

	'second' : 'User' ,

	'third' : 'user' ,

	'fourth' : 'user' ,

	'fifth' : 'User' ,

	'query' : 'user' ,

	'word' : 'User' ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'otherPrivilege' : ['staff' , 'lecturer' , 'hod' , 'dean' , 'bursar']

};

let ectrl = require('../controller/index')(opts);


router
			.route('/forgot-password')

			.get(qType.isOkay)

			.put(ectrl.entryforgotPassword$);


router.route('/reset/:token')

			.get(ectrl.resetPassword)

			.post(ectrl.resetPassword$);



module.exports = router;