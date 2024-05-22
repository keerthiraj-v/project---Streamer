const express = require("express");
const app = express();
const cors = require('cors');
const Realm = require('realm');

app.use(cors())
app.use(express.json())

const realmConfig = {
    path: "entries/default.realm",
    schema: [
      {
        name: 'Streamer',
        properties: {
            uid: 'string',
            file: 'string',
            size: 'string',
            date: 'string'
        }
      }
    ],
}

app.post('/create', (req, res) => {
    Realm.open(realmConfig)
    .then(realm => {
        realm.write(() => {
            realm.create('Streamer', { 
              uid: req.body.uid,
              file: req.body.file,
              size: req.body.size,
              date: req.body.date
            });
        });
        res.status(200).json({status: 'success', message: 'File uploaded successfully'});
    })
    .catch(error => {
        console.error('Failed to open Realm:', error);
    });
})

app.get('/read', (req, res) => {
    Realm.open(realmConfig)
    .then(realm => {
        const stored = realm.objects('Streamer');
        res.send(stored)
    })
    .catch(error => {
        res.send('Data read failed')
    })
})

app.get('/delete/:vid', (req, res) => {
    console.log(req.params.vid);
    try{
        Realm.open(realmConfig)
        .then(realm => {
            realm.write(() => {
                const toDelete = realm.objects('Streamer').filtered(`uid = "${req.params.vid}"`);
                realm.delete(toDelete);
                res.send('File deleted successfully.')
            })
        })
        .catch(error => {
            console.log(error);
            res.send('Failed to delete the entry')
        })
    }
    catch(e){
        res.send('Failed to delet the file.')
    }
})

app.listen(3004, () => console.log('DB started at port 3004'))