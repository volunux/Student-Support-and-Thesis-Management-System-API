module.exports = {
		
		'secretAccessKey': process.env.aremiuser_secretkey ,

		'accessKeyId': process.env.aremiuser_accesskey ,

		'region' : process.env.photos_region ,

		'Bucket' : process.env.photos_bucket ,

		'correctClockSkew' : true ,

		'maxRetries' : 4 ,

		'httpOptions' : {

				'timeout' : 86400000 ,

				'connectTimeout' : 12000
		}

}