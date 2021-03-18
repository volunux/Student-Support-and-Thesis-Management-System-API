let crypto = require('crypto-random-string');

let nuller = require('../utility/null-checker');

let queryBuilder = require('../utility/query-builder');

let sQuery = require('../search/general-one/country');

module.exports = {

	'userEntries' : (req , res , opts) => {

		let query = `SELECT json_build_object(

									'GeneralRequest' , (SELECT row_to_json(gr) FROM (SELECT COUNT(*) AS total , 'General Request' AS name FROM GENERAL_REQUEST) AS gr ) ,

									'GeneralPayment' , (SELECT row_to_json(gp) FROM (SELECT COUNT(*) AS total , 'General Payment' AS name FROM GENERAL_PAYMENT) AS gp ) ,

									'Refund' , (SELECT row_to_json(rf) FROM (SELECT COUNT(*) AS total , 'Refund' AS name FROM REFUND) AS rf )

									) AS result

								`;

		return query;

	} ,

	'user' : (req , res , opts) => {

		let query = `SELECT json_build_object(

										'ViceChancellor' , (SELECT row_to_json(vc) FROM (SELECT COUNT(*) AS total , 'Vice Chancellor' AS name FROM USERS AS u 

																				INNER JOIN ROLE AS rl ON rl.role_id = u.role_id 

																				WHERE rl.name = 'viceChancellor' LIMIT 1) AS vc ) ,

										'Chancellor' , (SELECT row_to_json(c) FROM (SELECT COUNT(*) AS total , 'Chancellor' AS name FROM USERS AS u 

																				INNER JOIN ROLE AS rl ON rl.role_id = u.role_id 

																				WHERE rl.name = 'hancellor' LIMIT 1) AS c ) ,

										'Registrar' , (SELECT row_to_json(rg) FROM (SELECT COUNT(*) AS total , 'Registrar' AS name FROM USERS AS u 

																				INNER JOIN ROLE AS rl ON rl.role_id = u.role_id 

																				WHERE rl.name = 'registrar' LIMIT 1) AS rg ) ,

										'Bursar' , (SELECT row_to_json(bur) FROM (SELECT COUNT(*) AS total , 'Bursar' AS name FROM USERS AS u 

																				INNER JOIN ROLE AS rl ON rl.role_id = u.role_id 

																				WHERE rl.name = 'bursar' LIMIT 1) AS bur ) ,

										'Librarian' , (SELECT row_to_json(lib) FROM (SELECT COUNT(*) AS total , 'Librarian' AS name FROM USERS AS u 

																				INNER JOIN ROLE AS rl ON rl.role_id = u.role_id 

																				WHERE rl.name = 'librarian' LIMIT 1) AS lib ) ,

										'Staff' , (SELECT row_to_json(stf) FROM (SELECT COUNT(*) AS total , 'Staff' AS name FROM USERS AS u 

																				INNER JOIN ROLE AS rl ON rl.role_id = u.role_id 

																				WHERE rl.name = 'staff' LIMIT 1) AS stf ) ,

										'Dean' , (SELECT row_to_json(dn) FROM (SELECT COUNT(*) AS total , 'Dean of Faculty' AS name FROM USERS AS u 

																				INNER JOIN ROLE AS rl ON rl.role_id = u.role_id 

																				WHERE rl.name = 'dean' LIMIT 1) AS dn ) ,

										'HeadOfDepartment' , (SELECT row_to_json(hod) FROM (SELECT COUNT(*) AS total , 'Head of Department' AS name FROM USERS AS u 

																				INNER JOIN ROLE AS rl ON rl.role_id = u.role_id 

																				WHERE rl.name = 'hod' LIMIT 1) AS hod ) ,

										'Lecturer' , (SELECT row_to_json(lc) FROM (SELECT COUNT(*) AS total , 'Lecturer' AS name FROM USERS AS u 

																				INNER JOIN ROLE AS rl ON rl.role_id = u.role_id 

																				WHERE rl.name = 'lecturer' LIMIT 1) AS lc ) ,

										'LevelAdviser' , (SELECT row_to_json(la) FROM (SELECT COUNT(*) AS total , 'Level Adviser' AS name FROM USERS AS u 

																				INNER JOIN ROLE AS rl ON rl.role_id = u.role_id 

																				WHERE rl.name = 'levelAdviser' LIMIT 1) AS la ) ,

										'Secretary' , (SELECT row_to_json(sec) FROM (SELECT COUNT(*) AS total , 'Secretary' AS name FROM USERS AS u 

																				INNER JOIN ROLE AS rl ON rl.role_id = u.role_id 

																				WHERE rl.name = 'secretary' LIMIT 1) AS sec ) ,

										'FacultyPresident' , (SELECT row_to_json(sfp) FROM (SELECT COUNT(*) AS total , 'Faculty President' AS name FROM USERS AS u 

																				INNER JOIN ROLE AS rl ON rl.role_id = u.role_id 

																				WHERE rl.name = 'facultyPresident' LIMIT 1) AS sfp ) ,

										'departmentPresident' , (SELECT row_to_json(sdp) FROM (SELECT COUNT(*) AS total , 'Department President' AS name FROM USERS AS u 

																				INNER JOIN ROLE AS rl ON rl.role_id = u.role_id 

																				WHERE rl.name = 'departmentPresident' LIMIT 1) AS sdp ) ,

										'Student' , (SELECT row_to_json(stu) FROM (SELECT COUNT(*) AS total , 'Student' AS name FROM USERS AS u 

																				INNER JOIN ROLE AS rl ON rl.role_id = u.role_id 

																				WHERE rl.name = 'student' LIMIT 1) AS stu ) ,

										'Moderator' , (SELECT row_to_json(mod) FROM (SELECT COUNT(*) AS total , 'Moderator' AS name FROM USERS AS u 

																				INNER JOIN ROLE AS rl ON rl.role_id = u.role_id 

																				WHERE rl.name = 'moderator' LIMIT 1) AS mod ) ,

										'Administrator' , (SELECT row_to_json(adm) FROM (SELECT COUNT(*) AS total , 'Administrator' AS name FROM USERS AS u 

																				INNER JOIN ROLE AS rl ON rl.role_id = u.role_id 

																				WHERE rl.name = 'administrator' LIMIT 1) AS adm ) ,

										'SuperAdministrator' , (SELECT row_to_json(sadm) FROM (SELECT COUNT(*) AS total , 'Super Administrator' AS name FROM USERS AS u 

																				INNER JOIN ROLE AS rl ON rl.role_id = u.role_id 

																				WHERE rl.name = 'superAdministrator' LIMIT 1) AS sadm )

									) AS result`;

		return query;

	} ,

	'generalInternalOne' : (req , res , opts) => {

		let query = `SELECT json_build_object(

									'Country' , (SELECT row_to_json(ct) FROM (SELECT COUNT(*) AS total , 'Country' AS name FROM COUNTRY) AS ct ) ,

									'Department' , (SELECT row_to_json(dt) FROM (SELECT COUNT(*) AS total , 'Department' AS name FROM DEPARTMENT) AS dt ) ,

									'Faculty' , (SELECT row_to_json(ft) FROM (SELECT COUNT(*) AS total , 'Faculty' AS name FROM FACULTY) AS ft ) ,

									'Level' , (SELECT row_to_json(ll) FROM (SELECT COUNT(*) AS total , 'Level' AS name FROM LEVEL) AS ll ) ,

									'PaymentSession' , (SELECT row_to_json(pses) FROM (SELECT COUNT(*) AS total , 'Payment Session' AS name FROM PAYMENT_SESSION) AS pses ) ,

									'PaymentType' , (SELECT row_to_json(ptype) FROM (SELECT COUNT(*) AS total , 'Payment Type' AS name FROM PAYMENT_TYPE) AS ptype ) ,

									'RefundStage' , (SELECT row_to_json(rfst) FROM (SELECT COUNT(*) AS total , 'Refund Stage' AS name FROM REFUND_STAGE) AS rfst ) ,

									'RequestMessageTemplate' , (SELECT row_to_json(rmt) FROM (SELECT COUNT(*) AS total , 'Request Message Template' AS name FROM REQUEST_MESSAGE_TEMPLATE) AS rmt ) ,

									'RequestType' , (SELECT row_to_json(rt) FROM (SELECT COUNT(*) AS total , 'Request Type' AS name FROM REQUEST_TYPE) AS rt ) ,

									'Unit' , (SELECT row_to_json(ut) FROM (SELECT COUNT(*) AS total , 'Unit' AS name FROM UNIT) AS ut )

									) AS result

								`;

		return query;

	} ,

	'generalInternalTwo' : (req , res , opts) => {

		let query = `SELECT json_build_object(

									'GeneralRequestStatus' , (SELECT row_to_json(grs) FROM (SELECT COUNT(*) AS total , 'General Request Status' AS name FROM GENERAL_REQUEST_STATUS) AS grs ) ,

									'PaymentStatus' , (SELECT row_to_json(ps) FROM (SELECT COUNT(*) AS total , 'Payment Status' AS name FROM PAYMENT_STATUS) AS ps ) ,

									'Role' , (SELECT row_to_json(rl) FROM (SELECT COUNT(*) AS total , 'Role' AS name FROM ROLE) AS rl ) ,

									'Status' , (SELECT row_to_json(gs) FROM (SELECT COUNT(*) AS total , 'General Status' AS name FROM STATUS) AS gs ) ,

									'UserStatus' , (SELECT row_to_json(us) FROM (SELECT COUNT(*) AS total , 'User Status' AS name FROM USER_STATUS) AS us ) 

									) AS result

								`;

		return query;

	} ,

	'generalInternalThree' : (req , res , opts) => {

		let query = `SELECT json_build_object(

									'GeneralRequestComment' , (SELECT row_to_json(grc) FROM (SELECT COUNT(*) AS total , 'General Request Comment' AS name FROM GENERAL_REQUEST_COMMENT) AS grc ) ,

									'RefundComment' , (SELECT row_to_json(rfc) FROM (SELECT COUNT(*) AS total , 'Refund Comment' AS name FROM REFUND_COMMENT) AS rfc ) ,

									'Reply' , (SELECT row_to_json(ry) FROM (SELECT COUNT(*) AS total , 'Reply' AS name FROM REPLY) AS ry ) ,

									'RefundSignature' , (SELECT row_to_json(rfsig) FROM (SELECT COUNT(*) AS total , 'Refund Signature' AS name FROM REFUND_SIGNATURE) AS rfsig ) 

									) AS result

								`;

		return query;

	} ,

	'generalInternalFour' : (req , res , opts) => {

		let query = `SELECT json_build_object(

									'Attachment' , (SELECT row_to_json(atth) FROM (SELECT COUNT(*) AS total , 'Attachment' AS name FROM ATTACHMENT) AS atth ) ,

									'UserPhoto' , (SELECT row_to_json(upho) FROM (SELECT COUNT(*) AS total , 'User Photo' AS name FROM ATTACHMENT) AS upho ) ,

									'UserSignature' , (SELECT row_to_json(usig) FROM (SELECT COUNT(*) AS total , 'User Signature' AS name FROM ATTACHMENT) AS usig )

									) AS result

								`;

		return query;

	} ,

	'other' : (req , res , opts) => {

		let query = `SELECT json_build_object(

									'RefundLetter' , (SELECT row_to_json(rfl) FROM (SELECT COUNT(*) AS total , 'Refund Letter' AS name FROM REFUND_LETTER) AS rfl ) ,

									'RequestCredential' , (SELECT row_to_json(rc) FROM (SELECT COUNT(*) AS total , 'Request Credential' AS name FROM REQUEST_CREDENTIAL) AS rc ) ,

									'RequestPassword' , (SELECT row_to_json(rp) FROM (SELECT COUNT(*) AS total , 'Request Password' AS name FROM REQUEST_PASSWORD) AS rp )

									) AS result

								`;

		return query;

	} , 

}