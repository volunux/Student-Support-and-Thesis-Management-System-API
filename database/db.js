const { Pool } = require('pg');

const $rpd = require('../app_api/helper/responder');

const COUNTRY = require('../tables/general-five/request_change_message_template_type');

const pool = new Pool({

'connectionString' : process.env.DATABASE_URL,

'ssl': {
    'rejectUnauthorized': false
  } 

});

// const pool = new Pool({

// 'user' : 'postgres' ,

// 'host' : '127.0.0.1',

// 'database' : 'store',

// 'password' : '12345',

// 'port' : '5432'});

// pool.query(COUNTRY.CREATE_TABLE , (err, res) => {

// console.log(err);

// console.log(res);

// pool.end();
// });

pool.connect()

.then((connected) => {

  console.log('Connected');
})

.catch((err) => {

  console.log(err);

});

module.exports = {

  'query' : (text , params , callback) => {
    	
    	const start = Date.now();
    	
    	return pool.query(text , params , (err , res) => {

       console.log(err);

      const duration = Date.now() - start

      // console.log(res);

      // console.log('executed query', { text , duration , rows : res.rowCount })
      
      callback(err , res);
    
    })
  
  }

};



// psql -d store -U postgres