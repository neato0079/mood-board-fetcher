require('dotenv').config()
// import * as dotenv from 'dotenv'
// dotenv.config()
const fs = require('fs');
const mysql = require('mysql2');
// import {fs} from 'fs'
// import * as fs from 'fs';
// import * as mysql from 'mysql2';
// import {mysql} from 'mysql2'
const {
    ART_REF_DB_PASS,
    USER
} = process.env;

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'art_ref_db'
    // port 3306
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
    VALUES ('${img}', '/${aritst}');
    `)//                   ^^^^ CHANGE ARTIST TO PATH AND REMOVE THE '/' WHEN READY FOR FINAL BUILD
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

                await pool.query(`
                INSERT INTO test_ass 
                SET image_id = (
                        SELECT id FROM test_img 
                        WHERE img_name = '${img}'
                    ), 
                    artist_id = (
                        SELECT id FROM test_artist 
                        WHERE artist_name = '${artist}'
                    );
                `)
                console.log('created associations!')
            }
        }
    }
}

const createAssociationImgWithArtist = async (library, associationTable) => {
    for (const artist in library) {
        if (artist != 'libRootPath') {
            const artistImages = library[artist]
            for (const img of artistImages) {
                if (img == '.DS_Store') {
                    continue
                }
                await pool.query(`
                INSERT INTO ${associationTable} 
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

const create = async (table, column, value) => {
    await pool.query(`
    INSERT INTO ${table} WHERE ${column} = ?
    `, value)
}

const removeValue = async (table, column, value) => {
    await pool.query(`
    DELETE FROM ${table} WHERE ${column} = ${value}
    `)
}

const removeImage = async (img_id) => {
    await pool.query(`
    DELETE FROM image WHERE id = ${img_id};
    DELETE FROM image_artist WHERE img_id = ${img_id};
    DELETE FROM image_genre WHERE img_id = ${img_id};
    DELETE FROM image_ip WHERE img_id = ${img_id};
    DELETE FROM image_key_word WHERE img_id = ${img_id};
    `)
}

const getImageData = async (id) => {
    const result = await pool.query(`
    SELECT * 
    FROM test_img
    WHERE id = ${id}
    `)
    // TODO: this only returns data from the main image table. get it to return data from the association tables as well. maybe thats what the JOIN keyword is for?
    return result[0][0]
}

const getImagePath = async (id) => {
    const imageData = await getImageData(id)
    const fileLocationFixed = decodeURI(imageData.file_loc)
    const imageURL = fileLocationFixed + '/' + imageData.img_name
    // console.log(imageURL)
    return imageURL
}

const fillDatabase = async () => {
    const prodArtLib = await createArtLibraryObj('/Users/mattbot/Pictures/art-ref/')
    // console.log(await prodArtLib)
    await insertEntireArtLib(prodArtLib)
    await createAssociationImgWithArtist(prodArtLib, 'test_ass')
}

const artistSearch = async (artistNames) => {
    // const namesList = [decodeURI(artistNames).split(',')]
    const namesList = [artistNames.split(',')]
    // const test = [['warashi', 'chenrong']]
    const result = await pool.query(`
    SELECT test_img.img_name, test_img.file_loc, test_artist.artist_name
    FROM test_artist, test_ass
    JOIN test_img
    ON test_img.id = test_ass.image_id 
    WHERE test_artist.artist_name IN (?) AND test_artist.id = test_ass.artist_id;
    `, namesList) // the ? param is already passed as an array in mysql2 so we need the extra [] at line 176
    return result[0]
}

const getImagePathByArtist = async (artistNames) => {
    const imagesDataArray = await artistSearch(artistNames)
    // const imageData = imagesDataArray[Math.floor(Math.random() * imagesDataArray.length)]
    // const decodedImagesArray = Array.from(imagesDataArray, imageData => decodeURI(imageData.file_loc))
    // const fileLocationFixed = decodeURI(imageData.file_loc)

    // for (let imageData of imagesDataArray){
    //     imageData.file_loc = decodeURI(imageData.file_loc)
    // }

    const paths = imagesDataArray.map( imageData => imageData.file_loc + '/' + imageData.img_name)

    // const imageURL = fileLocationFixed + '/' + imageData.img_name

    return paths
    
    // return decodedImagesArray
}

const main = async () => {
    console.log(await getImageData(1))
}
// fillDatabase()
// main()
// TODO:

// insert('image', columns, imgValues) // BECAREFUL OF DUPLICATE ENTRIES. WILL ERROR OUT
// THIS WAS ADDED TO PREVENT DUPLICATES. NEED TO FIND A WAY TO HANDLE ERRORS NOW
// ALTER TABLE image
// ADD CONSTRAINT unique_location UNIQUE (img_name, img_location);

// install npm package nodemon. This tool restarts our server as soon as we make a change in any of our files, otherwise we need to restart the server manually after each file modification
const testFunc = () => {
    console.log("Button clicked")
}
// export {
//     insert,
//     insertBaseData,
//     createArtLibraryObj,
//     insertEntireArtLib,
//     createAssociationImgWithArtist,
//     create,
//     removeValue,
//     removeImage,
//     getImageData,
//     getImagePath,
// }
module.exports = {
    insert,
    insertBaseData,
    createArtLibraryObj,
    insertEntireArtLib,
    createAssociationImgWithArtist,
    create,
    removeValue,
    removeImage,
    getImageData,
    getImagePath,
    artistSearch,
    getImagePathByArtist
}