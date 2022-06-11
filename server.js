const express = require("express");
const cors = require("cors");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const os = require("os");
const upload = multer({ dest: os.tmpdir() });

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", express.static(__dirname + "/public")); // static public folder

var fs = require("fs");
const { exec } = require("child_process");

const pythonClassifierPath = "ImageClassificationML.py";

app.post("/getPrediction", upload.single("file"), function (req, res) {
  const file = req.file;
  getPrediction(file.path, function (contents) {
    res.send(contents);
  });
});

function getPrediction(path, callback) {
  exec(`python3 ${path}`, function (error, stdout, stderr) {
    if (error || stderr) {
      console.log("Python error: " + error);
      console.log("Python stderr: " + stderr);
      process.exit();
    }
    callback(stdout);
  });
}

const port = 5000;
app.listen(port, () => console.log(`server started on port ${port}`));
