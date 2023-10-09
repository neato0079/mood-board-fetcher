const express = require('express');
const database = require('./database/database');
// import express from 'express'
// import * as database from './database/database.js'
const app = express();
app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use('/pics', express.static('/Users/mattbot/Pictures/art-ref'));
app.use(express.json())

app.get('/', async (req, res) => {
    res.render('index.ejs', { artistList: await database.getAllArtists() })
})

app.get('/random', async (req, res) => {
    const image_id = Math.floor(Math.random() * 3676) + 1
    // console.log(`IMAGE ID: ${image_id}`)
    const imageURL = await database.getImagePath(image_id)
    const imagesData = await database.getImageData(image_id)
    const displayResults = `
    <img display: flex; style="max-width: 900px; max-height: 100%;" src=${'../pics' + encodeURI(imageURL)}>
    `
    res.render('searchPage.ejs', {
        displayResults,
        artistList: await database.getAllArtists(),
        imagesData: JSON.stringify(imagesData),
        imageID: imagesData.id,
        artistUser: '',
        imageCount:''
    })
})

app.get('/randomFav', async (req, res) => {
    const image_id = await database.getFavImage()
    // console.log(`IMAGE ID: ${image_id}`)
    const imageURL = await database.getImagePath(image_id)
    const imagesData = await database.getImageData(image_id)
    const displayResults = `
    <img style="max-width: 900px; max-height: 100%;" src=${'../pics' + encodeURI(imageURL)}>
    `
    res.render('searchPage.ejs', {
        displayResults,
        artistList: await database.getAllArtists(),
        imagesData: JSON.stringify(imagesData),
        imageID: image_id,
        artistUser: '',
        imageCount:''
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
    console.log(req.query)
    let imageCount = req.query.count
    let images = await database.getImagePathByArtist(req.query)
    if (imageCount > 30) {
        imageCount = 30
        console.log('30 image cap')
    }
    if (!imageCount) {
        imageCount = 6
    }
    images = images.slice(0, imageCount)
    console.log(images)
    console.log(`Found ${images.length} images from database`)
    if (images.length == 0) {
        res.render('noResult.ejs')
        return
    }

    // const createInput = (index) => {
    //     const input = document.createElement('input');
    //     input.type = 'text';
    //     input.id = 'favStatus' + index; // Give each input a unique ID
    //     input.addEventListener('change', function() {
    //         // Your event handling logic here
    //         console.log('Input changed for favStatus' + index);
    //     });

    //     // Add the input element to the container
    //     const container = document.getElementById('referenceImage');
    //     container.appendChild(input);
    // }

    const displayImages = (imagesObj) => {
        let result = ''
        for (let image of imagesObj) {
            console.log(image)
            let favStatus = ''
            if(image.fav){
                console.log('fav: '+image.fav)
                favStatus = 'checked'
            }
            imagePath = encodeURI(image.paths)
            console.log(favStatus)
            result += `
            <div class="result-object">
            <a href=${'../pics' + imagePath} target="_blank"><img style="max-width: 900px; max-height: 900px;border-radius: 6px;" src="${'../pics' + imagePath}";data-id=${image.img_id}></a>
            <input type="checkbox" id="${'favStatus' + image.img_id}" class="favStatus" value=${image.img_id} ${favStatus}>
            <label for="vehicle1">Toggle favorite status</label><br>
            </div>
            `
            // console.log(`Images:${image}`)
            // createInput(image.img_id)
        }
        return result
    }

    res.render('searchPage.ejs', {
        displayResults: displayImages(images),
        artistList: await database.getAllArtists(),
        testValue: 'test value',
        imagesData: JSON.stringify(images),
        imageID: images,
        artistUser: req.query.artistName,
        imageCount: imageCount
    })
    // res.send({msg:'hello'});
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


app.get('/toggleFav/:id', async (req, res) => {
    const id = req.params.id
    await database.toggleFav(id)
    console.log('toggled fav')
})
app.use((err, req, res, next) => { // This handles all errors
    console.error(err.stack)
    res.status(500).send('It broke...');
});

app.listen(3000);





