const fs = require('fs/promises');

const purge = async (path,files, purgeTarget) => {
    const removed = []
    for (dir of files) {
        if (purgeTarget.includes(dir.slice(-9))) {
            await fs.unlink(path + '/' + dir)
            removed.push(dir)
            const index = files.indexOf(dir)
            files.splice(index, 1)
        }
    }
    console.log(`${removed.length} content removed:`)
    console.log(removed)
    return files // remaining files
}

const purgeArtLib = async () => {
    const fullPath = '/Users/mattbot/Pictures/art-ref'
    try {
        const purgeTargets = ['.DS_Store', 'Thumbs.db']
        const mainDir = await fs.readdir(fullPath)
        console.log('Purging directories...')
        const result = await purge(fullPath, mainDir, purgeTargets)
        console.log('Purging files...')
        for (artist of result) {
            console.log(`Purging ${artist}...`)
            const imgFiles = await fs.readdir(fullPath + '/' + artist)
            const pathedImgFiles = imgFiles.map(fileName => artist + '/' + fileName)
            await purge(fullPath, pathedImgFiles, purgeTargets)

        }
        console.log(`Remaining directories:`)
        console.log(result)
    }
    catch (err) {
        throw err;
    }

}


purgeArtLib()