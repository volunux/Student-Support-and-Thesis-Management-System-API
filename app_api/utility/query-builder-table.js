class QueryBuilderTableMap {

	static common() {

			let map$ = new Map();

			map$.set('name' , 'name');
			map$.set('description' , 'description');
			map$.set('status' , 'status_id');
			map$.set('author' , 'user_id');

			return map$;
	}

	static photo() {

			let map$ = new Map();

			map$.set('location' , 'location');
			map$.set('mimetype' , 'mimetype');
			map$.set('size' , 'size');
			map$.set('key' , 'key');
			map$.set('author' , 'user_id');

			return map$;
	}

}


module.exports = {

	'department' : () => {

			let map$ = QueryBuilderTableMap.common();

			map$.set('abbreviation' , 'abbreviation');
			map$.set('faculty' , 'faculty_id');

			return map$; 	} ,

	'general' : () => {

			let map$ = QueryBuilderTableMap.common();

			map$.set('abbreviation' , 'abbreviation');

			return map$; 	} ,

	'general2' : () => {

			let map$ = QueryBuilderTableMap.common();

			map$.set('word' , 'word');

			return map$; 	} ,

	'requestType' : () => {

			let map$ = QueryBuilderTableMap.common();

			map$.set('abbreviation' , 'abbreviation');
			map$.set('unit' , 'unit_id');
			map$.set('title' , 'title');

			return map$; 	} ,

	'paymentSession' : () => {

			let map$ = QueryBuilderTableMap.common();

			map$.set('amount' , 'amount');
			map$.set('entry_type' , 'payment_type_id');

			return map$; 	} ,

	'accountChangeMessageTemplateType' : () => {

			let map$ = QueryBuilderTableMap.common();

			map$.set('title' , 'title');

			return map$; 	} ,

	'requestChangeMessageTemplateType' : () => {

			let map$ = QueryBuilderTableMap.common();

			map$.set('title' , 'title');

			return map$; 	} ,

	'userStatus' : () => {

			let map$ = QueryBuilderTableMap.common();

			map$.set('word' , 'word');

			return map$; 	} ,

	'generalRequestStatus' : () => {

			let map$ = QueryBuilderTableMap.common();

			map$.set('word' , 'word');
			map$.set('other_name' , 'other_name');

			return map$; 	} ,

	'role' : () => {

			let map$ = QueryBuilderTableMap.common();

			map$.set('word' , 'word');

			return map$; 	} ,

	'status' : () => {

			let map$ = QueryBuilderTableMap.common();

			map$.set('word' , 'word');

			map$.delete('status');

			return map$; 	} ,

	'userPhoto' : () => {

		return QueryBuilderTableMap.photo(); } ,

	'userSignature' : () => {

		return QueryBuilderTableMap.photo(); } ,

	'accountChangeMessageTemplate' : () => {

			let map$ = QueryBuilderTableMap.common();

			map$.set('title' , 'title');
			map$.set('body' , 'body');
			map$.set('entry_type' , 'account_change_message_template_type_id');

			return map$; } ,

	'requestChangeMessageTemplate' : () => {

			let map$ = QueryBuilderTableMap.common();

			map$.set('title' , 'title');
			map$.set('body' , 'body');
			map$.set('entry_type' , 'account_change_message_template_type_id');

			return map$; } ,
}