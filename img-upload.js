const { arch } = require('os');
const DBHelper = require('./db-helper.js')
const fs = require('fs');
const { connect } = require('http2');

const artLib = '/Users/mattbot/Pictures/art-ref/'
const testLibPath = '/Users/mattbot/Pictures/test/'

// create a function that returns all files in artist folders
// console.log(imgFilePaths)
// create a function that inserts all images from art-refs/ into the db
// this funciton should also insert artist names into the artist table respective to the artist folder in art-refs/

const createArtLibraryObj = (libRootPath) => {
    artLibraryObj = { libRootPath: libRootPath };
    const artistNames = fs.readdirSync(libRootPath);
    if (artistNames[0] == '.DS_Store') {
        artistNames.shift() // removes .DSstore
    }
    for (const artistName of artistNames) {
        const artistImages = fs.readdirSync(libRootPath + artistName);
        artLibraryObj[artistName] = artistImages
    }

    // artistNames.forEach((artistName) => {
    //     const artistImages = fs.readdirSync(libRootPath + artistName);
    //     artLibraryObj[artistName] = artistImages
    // })
    // read up on which kind of iteration to use: https://thecodebarbarian.com/for-vs-for-each-vs-for-in-vs-for-of-in-javascript.html
    return artLibraryObj
};

const testArtLib = createArtLibraryObj(testLibPath)

const insertEntireArtLib = (library) => {
    DBHelper.connection.connect((err) => {
        if (err) throw err;
        for (const artist in library) {
            if (artist != 'libRootPath') {
                const artistImages = library[artist]
                for (const img of artistImages) {
                    if (img == '.DS_Store') {
                        continue
                    }
                    const path = library['libRootPath'] + artist
                    DBHelper.insertBaseData(path, artist, img)
                }
            }
        }
    });
}

const createAssociationImgWithArtist = (library) => {
    DBHelper.connection.connect((err) => {
        if (err) throw err;
        for (const artist in library) {
            if (artist != 'libRootPath') {
                const artistImages = library[artist]
                for (const img of artistImages) {
                    if (img == '.DS_Store') {
                        continue
                    }
                    DBHelper.connection.query(`INSERT INTO test_ass SET image_id = (SELECT id FROM test_img WHERE img_name = '${img}'), artist_id = (SELECT id FROM test_artist WHERE artist_name = '${artist}');`)
                }
            }
        }
    });
}

// const prodArtLib = createArtLibraryObj('/Users/mattbot/Pictures/art-ref/')
// createAssociationImgWithArtist(prodArtLib)
// console.log('poop')