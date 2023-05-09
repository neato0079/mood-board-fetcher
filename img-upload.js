const { arch } = require('os');
const DBHelper = require('./db-helper.js')
const fs = require('fs');
// const { insert } = require('./db-helper');

// create a function that returns all folders in art-refs/
const artLib = '/Users/mattbot/Pictures/art-ref/'
const artistNames = fs.readdirSync(artLib)
// this removes '.DS_store' from the array. idk what that even is
artistNames.shift()
// console.log(artistNames)
const testfunc = () => {
    for (artistName of artistNames) {
        // console.log(artistName)
        const artist_folder = fs.readdirSync(artLib + artistName)
        const imgFilePaths = artist_folder.map(fileName => artLib + artistName + '/' + fileName)
        imgFilePaths.shift()
        console.log(imgFilePaths)
    }
}
// create a function that returns all files in artist folders
// console.log(imgFilePaths)
// create a function that inserts all images from art-refs/ into the db
// this funciton should also insert artist names into the artist table respective to the artist folder in art-refs/

/*
(root of art library) => return {
    root path: root path,
    subdirectory1: filename.jpg,
    subdirectory1: filename2.jpg,
    subdirectory2: filename.jpg,
}
(art library object) => {
    rootpath = artLibraryObject[0]
    for e in ALO{
        if ALO[e] != rootpath{
            inster(rootpath+e, img_table)
            insert(e, artist_table)
            insert(ALO[e], img_table)
        }
    }
}
*/

const testLibPath = '/Users/mattbot/Pictures/test/'

const createArtLibraryObj = (libRootPath) => {
    artLibraryObj = { libRootPath: libRootPath };
    const artistNames = fs.readdirSync(libRootPath);
    if (artistNames[0] == '.DS_Store'){
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
                    if(img == '.DS_Store'){
                        continue
                    }
                    const path = library['libRootPath'] + artist
                    // DBHelper.insertWithoutConnect('test_img', 'file_loc', path)
                    // DBHelper.insertWithoutConnect('test_img', 'img_name', img)
                    // DBHelper.insertWithoutConnect('test_artist', 'artist_name', artist)
                    DBHelper.insertBaseData(path, artist, img)
                }
            }
        }
    });
}

const prodArtLib = createArtLibraryObj('/Users/mattbot/Pictures/art-ref/')
// console.log(testArtLib)
// console.log(testArtLib['libRootPath'])
insertEntireArtLib(prodArtLib)