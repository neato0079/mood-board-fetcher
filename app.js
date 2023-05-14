const express = require('express');
const app = express();

const main = async() => {
    app.get('/asdf', async(req, res) => {
       res.send("Hello wor!dadsjkflasjdh!!!!fslkdfgsdlk;fjg!!!!!!!!");
       console.log(`RES: \n${res}`)
       console.log(`REQ: \n${req[0]}`)
    });

    app.get('/delete_image', async(req, res) => { // go to localhost/3000/delete_image to delete an image wtf how do i ueven use this
        res.send("This will trigger a deletion of a given image??????");
     });
    
    app.listen(3000);

}

main()

