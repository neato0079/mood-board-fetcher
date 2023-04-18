require('dotenv').config()
const mysql = require('mysql');
const {
    ART_REF_DB_PASS,
    USER
} = process.env;

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'art_ref_db'
    // password: ART_REF_DB_PASS
    // port: 3306
});


connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
    sql_statement = 'CREATE TABLE image (img_id INT NOT NULL PRIMARY KEY, img_name VARCHAR(255), img_location VARCHAR(255) NOT NUll)'
    connection.query(sql_statement, (err, result) => {
        if (err) throw err;
        console.log(`Image table created\n${result}`)
    });
});

// connection.end((err) => {
//     if (err) throw err;
//     console.log('Connection ended. Goodbye!');
// });