const express = require('express');
const database = require('./database/database');
// import express from 'express'
// import * as database from './database/database.js'
const app = express();

const main = async () => {
    app.use(express.static('public'))
    app.use('/pics', express.static('/Users/mattbot/Pictures/art-ref'));

    app.get('/deleteImage', async (req, res) => { 
        res.send("This will trigger a deletion of a given image??????");
    });

    app.get('/getImageData/:id', async (req, res) => {
        const id = req.params.id
        res.send(await database.getImageData(id)); 
    });

    app.get('/gotoimage', async (req, res) => {
        const image_id = Math.floor(Math.random() * 25)
        const imageURL = await database.getImagePath(image_id)
        res.send(`<div style="height: 90vh; object-fit: contain;"><img style="max-width: 100%; max-height: 100%;" src="pics/${imageURL}"></div>`)
    })

    app.use((err, req, res, next) => { // This handles all errors
        console.error(err.stack)
        res.status(500).send('It broke...');
    });

    app.listen(3000);


}

main()
