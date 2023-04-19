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
        const values_new = values.map(
            element => `('${element.name}', '${element.location}')`
            );
        console.log("Connected!");
        const sql_statement = `INSERT INTO ${table} (${columns.join(', ')}) VALUES ${values_new}`
        connection.query(sql_statement, (err, result) => {
            if (err) throw err;
            console.log(`${values.length}record(s) inserted`);
        });
    })
}

const columns = [
    'img_name',
    'img_location'
]
const values = [
    {
        name: 'test_name.jpg',
        location: 'some/test/location'
    },
    {
        name: 'test_name2.jpg',
        location: 'test_location2'
    }
]
// ('name', 'location')
// insert(table, columns, values)
const valuesString = (values) => {
    const result = values.map(element => `('${element.name}', '${element.location}')`);
    return result
}


// console.log(columns.join(', '))
// console.log(valuesString(values))
// console.log(values[0].name)
insert('image', columns, values)

// update img_id to auto-increment
// connection.connect((err) => {
//     if (err) {
//         throw err;
//     }
//     connection.query('ALTER TABLE image MODIFY img_id INT NOT NULL AUTO_INCREMENT',(err, result) => {
//         if (err) throw err;
//         console.log("img_id column now auto-increments");
//     });
// });

// connection.end((err) => {
//     if (err) throw err;
//     console.log('Connection ended. Goodbye!');
// });