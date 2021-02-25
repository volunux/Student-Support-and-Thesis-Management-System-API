let express = require('express');

let router = express.Router();

let opts = {

	'first' : 'User' ,

	'second' : 'User' ,

	'third' : 'user' ,

	'fourth' : 'user' ,

	'fifth' : 'User' ,

	'query' : 'user' ,

	'word' : 'User' ,

	'ut' : 'User Type' ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'otherPrivilege' : ['staff' , 'lecturer' , 'hod' , 'dean' , 'bursar'] ,

	'bucket' : 'users_bucket'

};

let ectrl = require('../../controller/user')(opts);

let validator = require('../../validators/register')(opts);



router
			.route('/entry/detail')

			.get(ectrl.entryDetail);


router
			.route('/entry/update')

			.get(ectrl.entryUpdate)

			.put(

				validator.userProfileUpdate$ ,

				ectrl.entryUpdate$);


router
			.route('/entry/deactivate')

			.get(ectrl.entryDeactivate)

			.put(ectrl.entryDeactivate$);


router
			.route('/entry/reactivate')

			.get(ectrl.entryReactivate)

			.put(ectrl.entryReactivate$);



router
			.route('/entry/change-password')

			.get(ectrl.entryExists)
			
			.put(

				validator.userPassword$ ,

				ectrl.entryUpdatePassword$);



router
			.route('/entry/change-photo')

			.get(ectrl.entryExists)

			.post(

				validator.userPhoto$ ,

				ectrl.updatePhoto$);


router
			.route('/entry/change-signature')

			.get(ectrl.entryExists)

			.post(

				validator.userPhoto$ ,

				ectrl.updateSignature$);


module.exports = router;