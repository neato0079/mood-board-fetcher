const fs = require('fs');

// create a function that returns all folders in art-refs/
const artLib = '/Users/mattbot/Pictures/art-ref/'
const artistNames = fs.readdirSync(artLib)
// this removes '.DS_store' from the array. idk what that even is
artistNames.shift()
console.log(artistNames)
for (artistName of artistNames) {
    // console.log(artistName)
    const artist_folder = fs.readdirSync(artLib + artistName)
    const imgFilePaths = artist_folder.map(fileName => artLib + artistName + '/' + fileName)
    imgFilePaths.shift()
    console.log(imgFilePaths)
}
// create a function that returns all files in artist folders
// console.log(imgFilePaths)
// create a function that inserts all images from art-refs/ into the db
// this funciton should also insert artist names into the artist table respective to the artist folder in art-refs/

```
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
            insert(e, table)
            insert(ALO[e], table)
        }
    }
}
```