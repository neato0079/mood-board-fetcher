require('dotenv').config()
const mysql = require('mysql');
const {
    ART_REF_DB_PASS,
    USER
} = process.env;

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    // database: 'art_ref_db'
    // password: ART_REF_DB_PASS
    // port: 3306
});


connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
    connection.query('CREATE DATABASE art_ref_db', (err, result) => {
        if (err) throw err;
        console.log(`Databease created\n${result}`)
    });
});

// connection.end((err) => {
//     if (err) throw err;
//     console.log('Connection ended. Goodbye!');
// });