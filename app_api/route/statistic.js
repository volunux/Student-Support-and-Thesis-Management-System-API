let express = require('express');

let router = express.Router();

let cUser = require('../helper/confirm-user');

const opt = {

	'first' : 'User' ,

	'second' : 'User' ,

	'third' : 'user' ,

	'fourth' : 'user' ,

	'fifth' : 'User' ,

	'query' : 'statistic' ,

	'word' : 'Statistic' ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

const ectrl = require('../controller/statistic')(opt);

router.get('/entries'	, 

						cUser.isOkAdmin);

router.get('/entries/user' , 

						ectrl.user);

router.get('/entries/user-entries' , 

						ectrl.userEntries);

router.get('/entries/general-internal-one'	, 

						ectrl.generalInternalOne);

router.get('/entries/general-internal-two'	, 

						ectrl.generalInternalTwo);

router.get('/entries/general-internal-three'	, 

						ectrl.generalInternalThree);

router.get('/entries/general-internal-four'	, 

						ectrl.generalInternalFour);

router.get('/entries/other'	, 

						ectrl.other);

module.exports = router;