const mysql = require('mysql');
const config = require('./config');
const express = require('express');
var app = express();
app.use(express.bodyParser());

app.post('/create_user', function(req, res) {
    console.log(req.body);
})

var con = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name
});

con.connect(function(err){
    if (err) throw err;
    console.log("Connected!");
    
    var sql = "show tables;";
    con.query(sql, function (err, result) {
        if (err) throw err;
        Object.keys(result).forEach(function(key) {
            var row = result[key];
            console.log(row);
        });
    });
});