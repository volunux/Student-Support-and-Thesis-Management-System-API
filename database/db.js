const { Pool } = require('pg');

const COUNTRY = require('../tables/request_message_template');

const pool = new Pool({

'connectionString' : process.env.DATABASE_URL ,

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


module.exports = {

  'query' : (text , params , callback) => {
    	
    	const start = Date.now();
    	
    	return pool.query(text , params , (err , res) => {

       console.log(err);     

      const duration = Date.now() - start

      console.log(res);

      // console.log('executed query', { text , duration , rows : res.rowCount })
      
      callback(err , res)
    
    })
  
  }

};



// psql -d store -U postgres