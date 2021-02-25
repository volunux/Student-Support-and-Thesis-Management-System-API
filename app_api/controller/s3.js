module.exports = (opts) => {

	let hasher = require('../helper/s3_hash.js');

	return {

		'hash' : (req , res , next) => {
  
  		let configs = {

    		'bucket' : process.env.posts_bucket ,

    		'region' : process.env.posts_region ,

    		'keyStart' : '' ,

    		'acl' : 'public-read-write' ,

				'secretKey': process.env.aremiuser_secretkey ,

				'accessKey': process.env.aremiuser_accesskey }

		  let s3Hash = s3Hasher.getHash(configs);

  		res.json(s3Hash);
		}

	}

}