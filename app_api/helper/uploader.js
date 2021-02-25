let path = require('path');

module.exports = {

	'getFileExtension' : (file) => {
																
		let ext =  path.extname(file);

		return ext;
	} ,

	'renameFile' : (req , res , next) => {

		let f = req.file;

		let ext =  path.extname(f.originalname);

		let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

		let imgUrl = '';

		let fileName = '';

			for(let i = 0 ; i < 6 ; i += 1) {

				imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));	}

			fileName = imgUrl + ext;

			return fileName;				

	}

}