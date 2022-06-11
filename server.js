//Libraries We Are Using
var shelljs = require('shelljs');
var fs = require('fs');
const https = require('https');
const detect = require('detect-file-type');
var exec = require('child_process').exec;
var request = require('request');
const express = require('express');
var favicon = require('serve-favicon');

// Imports the Google Cloud client library
const {Spanner} = require('@google-cloud/spanner');
const { json } = require('body-parser');

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
 const projectId = 'empowerbot-nywy';
 const instanceId = 'my-instance';
 const databaseId = 'monty-hacks';

// Creates a client
const spanner = new Spanner({
  projectId: projectId,
});

// Gets a reference to a Cloud Spanner instance and database
const instance = spanner.instance(instanceId);
const database = instance.database(databaseId);



//App Constants
const PORT = 7019;
const FarmingItemPyClassifier = 'ImageClassificationML.py';

//Server Init
const app = express();
// app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));

// var requestCount = 0;
// shelljs.rm('-r', 'upload/');
// shelljs.mkdir('upload/');




//REST API
//Routes

// app.use('/', express.static(__dirname + '/public')); // static public folder
var requestCount = 0;

app.use('/', express.static(__dirname + '/public')); // static public folder

function isSupported(id, callback){
    detect.fromFile('upload/'+id, function(err, result) {
        if (err || !result || result.ext !== 'jpg') {
            callback(false);
        }
        callback(true);
    });
}

function getPrediction(id, callback){
    exec('python3 '+FarmingItemPyClassifier+' upload/'+id, function(error, stdout, stderr){
        if(error || stderr){
            console.log('Python error: '+error);
            console.log('Python stderr: '+stderr);
            process.exit();
        }
        callback(stdout);
    });
}

async function getDbStuff(){
    const bob = null;
    // Reads rows from the Albums table
const albumsTable = await database.table('Albums');

const query = {
  columns: ['farmId', 'farmName', 'imgBase64', 'itemPrice', 'productDescription'],
  keySet: {
    all: true,
  },
};

try {
  const [rows] =  albumsTable.read(query);

  rows.forEach(row => {
   const bob = row.toJSON();
    console.log(
      `farmId: ${json.farmId}, farmName: ${json.farmName}, imgBase64: ${json.imgBase64}, itemPrice: ${json.itemPrice}, productDescription: ${json.productDescription}`
    );
    return bob;
  });
} catch (err) {
  console.error('ERROR:', err);
} finally {
  // Close the database when finished.
  await database.close();
}
return bob;
}

app.post('/getPrediction', function(req, res){
    if(!req.body.base64Image){
        res.send('No image provided');
        return;
    }
    var base64Data = req.body.base64Image.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/jpg;base64,/, "");
    var requestNumber = requestCount++;
    fs.writeFile("upload/"+requestNumber, base64Data, 'base64', function(err) {
        if(err){
            res.send("Error writing file: "+err);
            console.log("Error writing file: "+err);
            return;
        }
        isSupported(requestNumber, function(isIt){
            if(!isIt){
                res.send('File format not jpeg or jpg');
                return;
            }
            getPrediction(requestNumber, function(contents){
                // database.runTransaction(async (err, transaction) => {
                //     if (err) {
                //       console.error(err);
                //       return;
                //     }
                //     try {
                //       const [rowCount] = await transaction.runUpdate({
                //         sql: `INSERT itemInfo (farmId, farmName, imgBase64, itemPrice, productDescription) VALUES
                //         (6097217190, 'Joe'sFarm', 6097217191, 19.99, ` + contents +  `)`,
                //       });
                //       console.log(`${rowCount} records inserted.`);
                //       await transaction.commit();
                //     } catch (err) {
                //       console.error('ERROR:', err);
                //     } finally {
                //       // Close the database when finished.
                //       database.close();
                //     }
                //   });
                res.json({'prediction': contents});
                
            });
        });
        return;
    });
});

app.get('/getData', function(req, res) {
    

    res.json(getDbStuff)
});

app.listen(5000, () => {console.log("Server started on port 5000")})





