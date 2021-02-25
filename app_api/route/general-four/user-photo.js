var express = require('express');

let router = express.Router(); 

let cUser = require('../../helper/confirm-user');

let opts = {

	'first' : 'UserPhoto' ,

	'second' : 'User Photo' ,

	'third' : 'user-photo' ,

	'fourth' : 'userPhoto' ,

	'fifth' : 'UserPhoto' ,

	'query' : 'user-photo' ,

	'word' : 'User Photo' ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean'] ,

	'bucket' : 'users_bucket'

};

let gctrl = require('../../controller/general-one')(opts);

	
router.route('/entries')

			.get(

			cUser.roleType([...opts.superPrivilege]) ,

			gctrl.entries);


router
			.route('/delete/entry/many')

			.get(

				cUser.roleType([...opts.superPrivilege]) ,

				cUser.isOkAdmin)

			.patch(

				cUser.roleType([...opts.superPrivilege]) , 

				gctrl.entryDeleteMany$);

router
			.route('/delete/entry/all/')

			.get(

				cUser.roleType(['superAdministrator']) ,

				gctrl.entryDeleteAll)

			.delete( cUser.roleType(['superAdministrator']) , 

				gctrl.entryDeleteAll$);

module.exports = router;