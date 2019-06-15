var mysql      = require('mysql');
var connection;

class MYSQL {
    query(str){
        connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'asrkpvg7',
            database : 'striggerControl'
        });
        connection.connect((err)=>{
            connection.query(str, function (error, results, fields) {
                if (error) throw error;
                // console.log('The solution is: ', results);
                connection.destroy();
            });
        })
    }
    objToQuery(obj, table){
        var query = "insert into " + table;
        var col = "(";
        var val = "(";
        for(i in obj){
        }
    }
}

module.exports = MYSQL;
 

 
