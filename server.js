const express = require("express");
const cors = require('cors');
const vision = require('@google-cloud/vision');
const admin = require("firebase-admin");


const app = express();
app.use(cors());

let serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cloudove-technologie.firebaseio.com"
});

let db = admin.database();
let refPost = db.ref("server/saving-data/fireblog");

let historyRef = refPost.child("History");

//   export GOOGLE_APPLICATION_CREDENTIALS="/Users/Richard.Babjak@ibm.com/Desktop/Cloudove/CloudoveTechnologie-1f541530ffe2.json"


async function quickStart(img) {
    // Imports the Google Cloud client library

    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    //
    // console.log('Labels:', response);
    // // labels.forEach(label => console.log(label.description));

    return await client.annotateImage({
        "image": {"content": img.toString()},
        "features": [
            {"type": "LABEL_DETECTION", "maxResults": 50},
            {"type": "OBJECT_LOCALIZATION", "maxResults": 50},
            {"type": "WEB_DETECTION", "maxResults": 50}
        ]
    });
}


// // Parse incoming requests data

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));


app.listen(3000, () => {
    console.log("Server running on port 3000");
});


app.get("/", (req, res, next) => {
    res.json("Image recognition api v1");
});

app.post("/image", (req, res) => {
    if (!req.body.base) {
        return res.status(400).send({
            success: 'false',
            message: 'base64 is required'
        });
    } else {
        let img = req.body.base;
        img = img.slice(img.indexOf(',')+1);
        console.log(img);
        quickStart(img).then(data => {
            // console.log(data);
            res.send(data);

            let newPostRef = historyRef.push();
            newPostRef.set({
                image: {
                    base: img
                },
                labels:{
                     data: data[0].labelAnnotations
                },
                objects:{
                    data: data[0].localizedObjectAnnotations
                },
                similarImages: {
                    data: data[0].webDetection.visuallySimilarImages
                }
            });

        })
    }
});


let refGet = db.ref("server/saving-data/fireblog/History");

app.get("/history", (req, res, next) => {
    refGet.once("value", (dat) => {
        // console.log(dat);
        res.send(dat)
    });

});
