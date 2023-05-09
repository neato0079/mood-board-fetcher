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

// HELPERS:
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

const insertWithoutConnect = (table, column, value) => {
    // const values_new = values.map(
    //     element => `('${element.name}', '${element.location}')`
    // );
    console.log("Connected!");
    const sql_statement = `INSERT INTO ${table} (${column}) VALUES ("${value}");`
    connection.query(sql_statement, (err, result) => {
        if (err) throw err;
        console.log(`record(s) inserted`);
    });
}

// Base data includes the following: image name, image location, and artist name
// For example the image with path 'usr/pictures/John_Art/painting.jpg' will have the following data:
// image name: painting.jpg
// image location: usr/pictures/John_Art/
// artist name: John Art
const insertBaseData = (path, aritst, img) => { 
    // connection.query(`
    // START TRANSACTION;
    // INSTERT INTO test_img ('img_name', 'file_loc')
    // VALUES ('${img}', '${path}');
    // COMMIT;`,(err) => {
    //     if (err) throw err;
    //     console.log(`record(s) inserted`);
    // })
    connection.query(`INSERT INTO test_img (img_name, file_loc) VALUES ('${img}', '${path}');`,(err) => {
        if (err) throw err;
        console.log(`record(s) inserted`);
    })

    connection.query(`INSERT INTO test_artist (artist_name) SELECT ('${aritst}') WHERE NOT EXISTS (SELECT artist_name FROM test_artist WHERE artist_name='${aritst}');`, (err) => {
        if (err) throw err;
    })
}

// insertBaseDataTransaction('usr/pics/John_Art', 'John Art', 'painting.jpg')

const search = (user_input) => {
    // user input is taken from the front end and passed into here
    // returns img file path
}

const columns = [
    'img_name',
    'img_location'
]
const imgValues = [
    {
        name: 'test_name_unique12312312.jpg',
        location: 'some/test/location'
    },
    {
        name: 'test_name_unique2.jpg',
        location: 'test_location12331'
    }
]

const tables = [
    'artist',
    'genre',
    'image',
    'ip',
    'key_word'
]

// insert('image', columns, imgValues) // BECAREFUL OF DUPLICATE ENTRIES. WILL ERROR OUT
// THIS WAS ADDED TO PREVENT DUPLICATES. NEED TO FIND A WAY TO HANDLE ERRORS NOW
// ALTER TABLE image
// ADD CONSTRAINT unique_location UNIQUE (img_name, img_location);

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

module.exports = { 
    insert,
    insertWithoutConnect,
    insertBaseData,
    connection 
}