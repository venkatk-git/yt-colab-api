const admin = require("firebase-admin");
const path = require("path");
const { FIREBASE_DB_URL } = require("../config/variables");

const serviceAccount = require(path.resolve(
    __dirname,
    "../firebaseServiceAccountKey.json"
));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: FIREBASE_DB_URL,
});

module.exports = admin.database();
