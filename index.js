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

// CREATE IMAGE TABLE
// connection.connect((err) => {
//     if (err) throw err;
//     console.log("Connected!");
//     sql_statement = 'CREATE TABLE image (img_id INT NOT NULL PRIMARY KEY, img_name VARCHAR(255), img_location VARCHAR(255) NOT NUll)'
//     connection.query(sql_statement, (err, result) => {
//         if (err) throw err;
//         console.log(`Image table created\n${result}`)
//     });
// });

const insert = (table, columns, values) => {
    connection.connect((err) => {
        if (err) throw err;
        console.log("Connected!");
        const sql_statement = `INSTER INTO ${table} (${columns}) VALUES ('${values}')`
        connection.query(sql_statement, (err, result) => {
            if (err) throw err;
            console.log("1 record inserted");
        });
    })
}

const columns = [
    'img_name',
    'img_location'
]
const values = [
    'test_name.jpg',
    'some/test/location'
]
// insert(table, columns, values)

connection.connect((err) => {
    if (err) {
        throw err;
    }
    connection.query('ALTER TABLE image MODIFY img_id INT NOT NULL AUTO_INCREMENT',(err, result) => {
        if (err) throw err;
        console.log("img_id column now auto-increments");
    });
});

// connection.end((err) => {
//     if (err) throw err;
//     console.log('Connection ended. Goodbye!');
// });