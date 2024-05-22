const express = require('express');
const fs = require("fs");
const axios = require("axios")

const router = express.Router();

//onst DBPOINT = process.env.dbpoint
const DBPOINT = '192.168.0.213:3004'

router.get('/videos', (req, res) => {
    axios.get(`http://${DBPOINT}/read`)
    .then((response) => {
        res.send(response.data)
    })
    .catch((e) => {
        res.send('Failed to fetch the data')
    })
})

router.get('/del/:vid', (req, res) => {
    console.log(req.params.vid);
    axios.get(`http://${DBPOINT}/delete/${req.params.vid}`)
    .then((response) => {
        try{
            fs.rm('api/library/'+req.params.vid.toString(), { recursive: true }, (err) => {
                if (err) {
                    console.error('Error removing directory:', err);
                    res.send('Failed to delete the file.')
                } else {
                    res.send('File deleted successfully.')
                }
            });
        }
        catch(err){
            res.send('File not found or not exist')
        }
    })
    .catch((err) => {
        console.log('Failed to delete the file');
    })
})

module.exports = router;