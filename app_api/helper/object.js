let aws = require('aws-sdk');
let s3 = '';
let s3$ = require('../aws/buckets/s3/photoS3');
let $rpd = require('./responder');
let db = require('../../database/db');

aws.config.update(s3$);

s3 = new aws.S3();

module.exports = {

	'objectDeleteServer' : (opts) => {

		let params = {'Bucket' : process.env[opts.bucket] , 'Key' : opts.key };

		let key = opts.key;

		s3.deleteObject(params , (err , deleted) => {

			if (err) { console.log(err); }

			else { console.log('Object successfully deleted.') } });
	} ,

	'deleteMany' : (docs , opts) => { let docKeys = [] , keysX = [];

		docs.forEach((item) => { let key = null;

			if (item.location.includes('\\')) { key = item.location.split('\\').pop(); }

			else if (item.location.includes('/')) { key = item.location.split('/').pop(); }

			docKeys.push({'Key' : key });

			keysX.push(key); });

		let params = {'Bucket' : process.env[opts.bucket] , 'Delete' : {'Objects' : docKeys } };

		s3.deleteObjects(params , (err , deleted) => {

			if (err) { console.log(err); }

			else { let plan = opts.query$.deleteDocs$(keysX);

				db.query(plan , [] , (err , result) => {

						if (err) { console.log(`An Error occured while deleting objects.`); }

						if (result.rowCount < 1) { console.log(`Object to be deleted were not found.`); }

						if (result.rowCount >= 1) { console.log(`Object(s) successfully deleted.`); }	}); }	}); 
	} ,

	'deleteManyUpload' : (docs , opts) => { let itemKeys = [] , keysDelete = [];

		if (docs != null && docs.length > 0) {

			itemKeys = docs.map((x) => { return {'Key' : x.key}; });

			let params = {'Bucket' : process.env[opts.bucket] , 'Delete' : {'Objects' : itemKeys } };

			s3.deleteObjects(params , (err , deleted) => {

				if (err) { console.log(err); }

				else { console.log('Objects successfully deleted.')	}	}); }
	} ,

	'objectDeleteClient' : (req , res , next , opts) => {

		let params = {'Bucket' : process.env[opts.bucket] , 'Key' : opts.key };

		let key = opts.key;

		s3.deleteObject(params , (err , deleted) => {

			if (err) { console.log(err); }

			else { let plan = opts.query$.entryDelete$();

			db.query(plan , [key] , (err , result) => {

					if (err) { console.log(`An Error occured while deleting objects.`); }

					if (result.rowCount < 1) { return $rpd.handler(res , 204 , {'message' : 'Object to be deleted were not found.'}); }

					if (result.rowCount >= 1) { return $rpd.handler(res , 204 , {'message' : 'Object successfully deleted.'}); } }); } }); 
	} 


}