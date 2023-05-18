const express = require('express');
const database = require('./database/database');
// import express from 'express'
// import * as database from './public/database.js'
const app = express();

const main = async () => {
    // app.use(express.static('database'))
    app.use(express.static('public'))
    app.use('/pics', express.static('/Users/mattbot/Pictures/art-ref'));

    app.get('/asdf/:id', async (req, res) => { //endpoint
        const id = req.params.id
        // res.send(`Hello wor!dadsjkflasjdh!!!!fslkdfgsdlk;fjg!!!!!!!!${id}`);
        res.send(`${id}`)
        
        console.log(`RES: \n${res}`)
        console.log(`REQ: \n${req[0]}`)
    });

    app.get('/deleteImage', async (req, res) => { // go to localhost:    3000/delete_image to delete an image wtf how do i ueven use this
        res.send("This will trigger a deletion of a given image??????");
    });

    app.get('/getImageData/:id', async (req, res) => {
        const id = req.params.id
        res.send(await database.getImageData(id)); 
    });

    app.get('/checklink', async (req, res) => {
        // create file path with js function that calls db
        // pass that path to location
        res.send('https://expressjs.com/en/api.html#res.location')
        console.log('worked')
    })

    app.get('/gotoimage', async (req, res) => {
        // res.send(database.testFunc())
        res.send('aasldfkadklsfa')
        res.send(database.getImagePath(9))
    })


    app.use((err, req, res, next) => {
        console.error(err.stack)
        res.status(500).send('It broke...')
    });

    app.listen(3000);


}

main()

