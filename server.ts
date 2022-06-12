import express, { Request, Response } from "express";
const cors = require("cors");
const multer = require("multer");
const os = require("os");

interface MulterRequest extends Request {
  file: any;
}

const upload = multer({ dest: os.tmpdir() });

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", express.static(__dirname + "/public")); // static public folder

const { exec } = require("child_process");

const pythonClassifierPath = "./imageML.py";

app.post(
  "/getPrediction",
  upload.single("file"),
  function (req: Request, res: Response) {
    getPrediction("fruit", req, res);
  }
);

function getPrediction(type: string, req: Request, res: Response) {
  const file = (req as MulterRequest).file;

  const successCallback = (contents: string) => {
    res.send(contents);
  };

  exec(
    `python ${pythonClassifierPath} ${type} ${file.path}`,
    function (error: string, stdout: string, stderr: string) {
      if (error || stderr) {
        console.log("Python error: " + error);
        console.log("Python stderr: " + stderr);
        process.exit();
      }
      successCallback(stdout);
    }
  );
}

const port = 5000;
app.listen(port, () => console.log(`server started on port ${port}`));
