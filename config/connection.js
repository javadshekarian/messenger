const mysql=require('mysql');

var connection=mysql.createConnection({
    host:       'localhost',
    password:   '9601371893Jm',
    user:       'root',
    database:   'messenger'
})

connection.connect(err=>{
    if(err) throw err;
})

module.exports={
    connection
}