const admin = require('firebase-admin');
const serviceAccount = require('../global-approach-214817-bc447bd6a8d9.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

db.settings({ timestampsInSnapshots: true });

module.exports = db;