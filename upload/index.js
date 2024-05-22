const fs = require('fs')
const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');

app.use(cors())
app.use(express.json())

//const ENDPOINT = process.env.endpoint
//const DBPOINT = process.env.dbpoint
const ENDPOINT = '192.168.0.213:5000'
const DBPOINT = '192.168.0.213:3004'

/* Multer storage configuration */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'library');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.get('/', (req, res) => {
    res.send('Upload server is working fine...!')
})

/*---------------------- To handle file upload from web ----------------------*/
app.post('/upload', upload.single('file'), (req, res) => {
  
  let { uid, file, size, type, date } = JSON.parse(req.body.objectData)

  let original = 'library/'+file
  let renamed = 'library/'+uid+'.'+file.split('.')[1]

  fs.rename(original, renamed, () => { 
    axios.get(`http://${ENDPOINT}/convert/${uid+'.'+file.split('.')[1]}`)
    .then((response) => {

      axios.post(`http://${DBPOINT}/create`, {
        uid: uid.toString(), 
        file: file.split('.')[0]+'.'+'mp4',
        size: size.toString(), 
        date: date.toString()
      })
      .then((response) => {
        fs.unlinkSync(renamed)
        res.status(200).json({status: 'success', message: 'File uploaded successfully'});
      })
      .catch((err) => {
        res.status(200).json({status: 'failed', message: 'Failed to add entry in DB'});
      })
    })
    .catch((err) => {
      res.status(200).json({status: 'failed', message: 'File conversion failed'});
    })
  });
});


app.listen(3002, () => console.log(`Storage Server is running on port 3002`))