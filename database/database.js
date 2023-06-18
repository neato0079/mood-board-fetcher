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
    // port 3306
}).promise()

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
                        WHERE img_name = '${img}' AND file_loc = '/${artist}'
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

const getFavImage = async () => {
    const favorites = await pool.query(`
    SELECT img.id, artist.artist_name
    FROM   test_img AS img
           JOIN test_ass AS ass 
           ON ass.image_id = img.id
           JOIN test_artist AS artist 
           ON artist.id = ass.artist_id
           LEFT JOIN test_word_img AS wordimg 
           ON img.id = wordimg.image_id
           LEFT JOIN test_word AS word 
           ON word.id = wordimg.word_id
    WHERE img.favorite = 1;
    `)
    const result = favorites[0][Math.floor(Math.random() * favorites.length)]
    return result
}

const getImageData = async (id) => {
    const result = await pool.query(`
    SELECT img.img_name, artist.artist_name, word.key_word, img.view_count, img.file_loc
    FROM   test_img AS img
           JOIN test_ass AS ass 
           ON ass.image_id = img.id
           JOIN test_artist AS artist 
           ON artist.id = ass.artist_id
           LEFT JOIN test_word_img AS wordimg 
           ON img.id = wordimg.image_id
           LEFT JOIN test_word AS word 
           ON word.id = wordimg.word_id
    WHERE img.id = ?;
    `, id)
    // TODO: this only returns data from the main image table. get it to return data from the association tables as well. maybe thats what the JOIN keyword is for?
    return result[0][0]
    /*
    SAMPLE DATA:
    {
        "img_name": "3ko_michiimage106.png",
        "artist_name": "3ko_michi",
        "key_word": null,
        "view_count": null,
        "file_loc": "/3ko_michi"
}
    */
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
    // console.log(artistNames)
    const roughList = artistNames.split(/,|, /)
    const namesList = [roughList.map(artistName => artistName.trim())]
    // const test = [['warashi', 'chenrong']]
    const result = await pool.query(`
    SELECT test_img.img_name, test_img.file_loc, test_artist.artist_name, test_img.id
    FROM test_artist, test_ass
    JOIN test_img
    ON test_img.id = test_ass.image_id 
    WHERE test_artist.artist_name IN (?) AND test_artist.id = test_ass.artist_id;
    `, namesList) // the ? param is already passed as an array in mysql2 so we need the extra [] at line 176
    return result[0]
}

const keyWordSearch = async (keyWords) => {
    // const namesList = [decodeURI(artistNames).split(',')]
    const roughList = keyWords.split(/,|, /)
    const wordsList = [roughList.map(keyWord => keyWord.trim())]
    // const test = [['warashi', 'chenrong']]
    const result = await pool.query(`
    SELECT test_img.img_name, test_img.file_loc
    FROM test_word, test_word_img
    JOIN test_img
    ON test_img.id = test_word_img.image_id 
    WHERE test_word.key_word IN (?) AND test_word.id = test_word_img.word_id;
    `, wordsList) // the ? param is already passed as an array in mysql2 so we need the extra [] at line 176
    return result[0]
}

// this isnt being used yet because its a wip
const getImagePathByAll = async (query) => {
    const imagesByArtist = await artistSearch(query.artistName);
    const imagesByKeyWord = await keyWordSearch(query.keyWord);
    const imagesDataArray = imagesByArtist.concat(imagesByKeyWord);
    console.log(imagesDataArray)
    // const imageData = imagesDataArray[Math.floor(Math.random() * imagesDataArray.length)]
    // const decodedImagesArray = Array.from(imagesDataArray, imageData => decodeURI(imageData.file_loc))
    // const fileLocationFixed = decodeURI(imageData.file_loc)

    // for (let imageData of imagesDataArray){
    //     imageData.file_loc = decodeURI(imageData.file_loc)
    // }

    const paths = imagesDataArray.map(imageData => imageData.file_loc + '/' + imageData.img_name)
    const smallPaths = paths.slice(0, 4)
    return smallPaths
}
const getImagePathByArtist = async (artistNames) => {
    const imagesDataArray = await artistSearch(artistNames.artistName)
    // console.log(imagesDataArray)
    const paths = imagesDataArray.map((imageData) => {
        return {
            paths: imageData.file_loc + '/' + imageData.img_name,
            img_id: imageData.id
    }
    })
    // console.log(paths)
    const smallPaths = paths.slice(0, 6)
    return smallPaths
}

const getAllArtists = async () => {
    const artistListObj = await pool.query(`
    SELECT test_artist.artist_name
    FROM test_artist;
    `)
    const artistList = []
    for (obj of artistListObj[0]) {
        artistList.push(obj.artist_name)
    }
    return artistList
}

const setFav = async (fav, id) => {
    await pool.query(`
    UPDATE art_ref_db.test_img 
    SET favorite = ? 
    WHERE id = ?;
    `, fav, id)
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
    getImagePathByArtist,
    getImagePathByAll,
    getAllArtists,
    getFavImage
}