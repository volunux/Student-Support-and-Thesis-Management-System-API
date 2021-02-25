let passport = require('passport');

let LocalStrategy = require('passport-local').Strategy;

let db = require('../../database/db');

let query$ = require(`../queries/authentication`);

let $user = require('../helper/user');

passport.use(new LocalStrategy({ 'usernameField' : 'email_address' } ,

	(email_address , password , done) => {

			let plan = query$.verifyEmail2({});

			let $e = email_address;

			db.query(plan , [$e] , (err , result) => {

				if (err) { return done(err); }

				if (result.rowCount < 1) { return done(null , false , {'message' : `The credential received does not exists in the record. Hint: Email Address.`	});	}

				if (result.rowCount >= 1) { let $result = result.rows[0];

					if ($user.validPassword(password , $result) == false) { 

						return done(null , false , { 'message' : `The credential received does not exists in the record. Hint: Password.` });	}

					else { return done(null , $result); } } }); } ));