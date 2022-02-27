const mysql = require('mysql');
const config = require('./config');

var con = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password
});

con.connect(function(err){
    if (err) throw err;
    console.log("Connected!");
    
    var sql = "use " + config.db.name + ";";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Result: " + result);
    });
});
//con.end();