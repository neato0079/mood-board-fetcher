require('dotenv').config()
const fs = require('fs');
const mysql = require('mysql2');
const {
    ART_REF_DB_PASS,
    USER
} = process.env;

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'art_ref_db'
}).promise()

const test = async () => {
    const [result] = await pool.query("SELECT * FROM test_img")
    console.log(result)
}
// test()

// HELPERS:
const insert = async (table, column, value) => {
    await pool.query(`
    INSERT INTO ${table} (${column}) 
    VALUES ("${value}");
    `)
}

// insert('test_img','img_name','test.jgp')

// Base data includes the following: image name, image location, and artist name
// For example the image with path 'usr/pictures/John_Art/painting.jpg' will have the following "base data":
// image name: painting.jpg
// image location: usr/pictures/John_Art/
// artist name: John Art
const insertBaseData = async (path, aritst, img) => {
    // inserts into img table
    await pool.query(`
    INSERT INTO test_img (img_name, file_loc) 
    VALUES ('${img}', '${path}');
    `)
    // inserts into artist table only if the respective artist is not already in the table
    await pool.query(`
    INSERT INTO test_artist (artist_name) 
    SELECT ('${aritst}') 
    WHERE NOT EXISTS (SELECT artist_name FROM test_artist WHERE artist_name='${aritst}');
    `)
}

// insertBaseDataTransaction('usr/pics/John_Art', 'John Art', 'painting.jpg')

const createArtLibraryObj = async (libRootPath) => {
    artLibraryObj = { libRootPath: libRootPath };
    const artistNames = fs.readdirSync(libRootPath);
    if (artistNames[0] == '.DS_Store') {
        artistNames.shift() // removes .DSstore
    }
    for (const artistName of artistNames) {
        const artistImages = fs.readdirSync(libRootPath + artistName);
        artLibraryObj[artistName] = artistImages
    }
    return artLibraryObj
};

const insertEntireArtLib = async (library) => {
    console.log('inserting data....')
    for (const artist in library) {
        if (artist != 'libRootPath') {
            const artistImages = library[artist]
            for (const img of artistImages) {
                if (img == '.DS_Store') {
                    continue
                }
                const path = library['libRootPath'] + artist
                await insertBaseData(path, artist, img)
                console.log('inserted data!')
            }
        }
    }
}

const createAssociationImgWithArtist = async (library) => {
    for (const artist in library) {
        if (artist != 'libRootPath') {
            const artistImages = library[artist]
            for (const img of artistImages) {
                if (img == '.DS_Store') {
                    continue
                }
                await pool.query(`
                INSERT INTO test_ass 
                SET image_id = (
                        SELECT id FROM test_img 
                        WHERE img_name = '${img}'
                    ), 
                    artist_id = (
                        SELECT id FROM test_artist 
                        WHERE artist_name = '${artist}'
                    );`
                )
            }
        }
    }
}

const update = async(table, column, value) => {

}

const removeValue = async(table, column, value) => {

}

const removeImage = async(img_id) => {
    await pool.query(`
    DELETE FROM image WHERE id = ${img_id};
    DELETE FROM image_artist WHERE img_id = ${img_id};
    DELETE FROM image_genre WHERE img_id = ${img_id};
    DELETE FROM image_ip WHERE img_id = ${img_id};
    DELETE FROM image_key_word WHERE img_id = ${img_id};
    `)
}
// insert('image', columns, imgValues) // BECAREFUL OF DUPLICATE ENTRIES. WILL ERROR OUT
// THIS WAS ADDED TO PREVENT DUPLICATES. NEED TO FIND A WAY TO HANDLE ERRORS NOW
// ALTER TABLE image
// ADD CONSTRAINT unique_location UNIQUE (img_name, img_location);

const main = async () => {
    const prodArtLib = await createArtLibraryObj('/Users/mattbot/Pictures/art-ref/')
    // console.log(await prodArtLib)
    // await insertEntireArtLib(prodArtLib)
    await createAssociationImgWithArtist(prodArtLib)
}

main()
module.exports = {
    insert,
    insertBaseData,
    pool
}