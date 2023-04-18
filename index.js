require('dotenv').config()
const mysql = require('mysql');
const {
    ART_REF_DB_PASS,
    USER
} = process.env;

const con = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    // password: ART_REF_DB_PASS
    // port: 3306
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});