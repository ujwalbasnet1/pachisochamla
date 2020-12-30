var mysql = require('mysql');

var db_config = {
    adapter: "mysql",
    host: 'localhost',
    port: 8080,
    user: 'root',
    password: '',
    database: 'test',
    // connectTimeout  : 60 * 60 * 1000,
    // acquireTimeout  : 60 * 60 * 1000,
    // timeout         : 60 * 60 * 1000,
};

   var pool = mysql.createPool(db_config); // Recreate the pool, since
                                                    // the old one cannot be reused.


    pool.getConnection(function(err, connection){
        if(err){
            throw err;
        }

        connection.query("SELECT * from user", function(err, data){
            connection.release();
            console.log(data);
        });
    });
