const aws = require('aws-sdk');

module.exports = function postPhotos() {

return new aws.S3({

	'secretAccessKey': process.env.aremiuser_secretkey ,

	'accessKeyId': process.env.aremiuser_accesskey ,

	'region' : process.env.photos_region ,

	'Bucket' : process.env.photos_bucket ,

	'maxRetries' : 2 ,

	'httpOptions' : {

			'timeout' : 86400000 ,

			'connectTimeout' : 12000
	}
});

}