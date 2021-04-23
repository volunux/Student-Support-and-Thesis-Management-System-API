var express = require('express');

let router = express.Router(); 

let cUser = require('../../helper/confirm-user');

let AtthRepo = require(`../../queries/attachment`).AttachmentRepository;

let query$ = new AtthRepo();

let opts = {

	'first' : 'Attachment' ,

	'second' : 'Attachment' ,

	'third' : 'attachment' ,

	'fourth' : 'attachment' ,

	'fifth' : 'Attachment' ,

	'query' : 'attachment' ,

	'word' : 'Attachment' ,

	'query$' : query$ ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean'] ,

	'bucket' : 'photos_bucket'

};

let ectrl = require('../../controller/upload')(opts);
	
router.route('/entry/create')

			.post(ectrl.entryAdd$);

router.route('/entries')

			.get(

			cUser.roleType([...opts.superPrivilege]) ,

			ectrl.entries);


router
			.route('/delete/entry/many')

			.get(

				cUser.roleType([...opts.superPrivilege]) ,

				cUser.isOkAdmin)

			.patch(

				cUser.roleType([...opts.superPrivilege]) , 

				ectrl.entryDeleteMany$);

router
			.route('/delete/entry/all/')

			.get(

				cUser.roleType(['superAdministrator']) ,

				ectrl.entryDeleteAll)

			.delete( cUser.roleType(['superAdministrator']) , 

				ectrl.entryDeleteAll$);

module.exports = router;