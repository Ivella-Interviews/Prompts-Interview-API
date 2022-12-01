
const admin = require('firebase-admin');

const serverCredLoc = "../keys/ivella-372e0-6efe5ce0a17c.json";
const projectID = 196913845480;

const serviceAccount = require(serverCredLoc);



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();



module.exports.db = db;
module.exports.admin = admin;
module.exports.projectID = projectID;
