const express = require('express');
const database = require('./database/database');
// import express from 'express'
// import * as database from './database/database.js'
const app = express();
app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use('/pics', express.static('/Users/mattbot/Pictures/art-ref'));

app.get('/', async(req, res) => {
    res.render('index.ejs', {artistList: await database.getAllArtists()})
})

app.get('/random', async(req, res) =>{
    const image_id = Math.floor(Math.random() * 1477) + 854
    console.log(`IMAGE ID: ${image_id}`)
    const imageURL = await database.getImagePath(image_id)
    const displayResults =`
    <img style="max-width: 100%; max-height: 100%;" src=${'../pics' + encodeURI(imageURL)}>
    `
    res.render('searchPage.ejs', {
        displayResults,
        artistList: await database.getAllArtists()
    })
})

app.get('/deleteImage', async (req, res) => {
    res.send("This will trigger a deletion of a given image??????");
});

app.get('/getImageData/:id', async (req, res) => {
    const id = req.params.id
    res.send(await database.getImageData(id));
});

app.get('/search', async (req, res) => {
    const paths = await database.getImagePathByArtist(req.query)
    if (paths.length == 0) {
        res.render('noResult.ejs')
        return
    }
    const displayImages = (paths) => {
        let result = ''
        for (let image of paths) {
            image = encodeURI(image) 
            result += `
            <a href=${'../pics' + image} target="_blank"><img style="max-width: 70%; max-height: 70%;" src=${'../pics' + image}></a>
            `
        }
        return result
    }

    res.render('searchPage.ejs', {
        displayResults: displayImages(paths),
        artistList: await database.getAllArtists()
    })
})


app.get('/test', async (req, res) => {
    // let page = req.query.page;
    // let limit = req.query.limit;
    console.log('ets')
    console.log(req.query)
    res.render('test.ejs', {
        val: 'poop',
        test: test = () => {
            return 'title'
        },
        searchResult: req.query.search
    })
})


app.use((err, req, res, next) => { // This handles all errors
    console.error(err.stack)
    res.status(500).send('It broke...');
});

app.listen(3000);





