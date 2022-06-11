//Libraries We Are Using
var shelljs = require('shelljs');
var fs = require('fs');
const https = require('https');
const detect = require('detect-file-type');
var exec = require('child_process').exec;
var request = require('request');
const express = require('express');
var favicon = require('serve-favicon');


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
                res.send(contents);
            });
        });
        return;
    });
});

app.get('/getData', function(req, res) {
    res.json({ "itemInfo": ["itemName", "imgURL", "healthDiagnosis"] })
});
app.listen(5000, () => {console.log("Server started on port 5000")})





