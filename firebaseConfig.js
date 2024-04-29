const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const firebaseConfig = {
        apiKey: "AIzaSyAZezNPTYcUt8QXpcx7LCroP84jXgk8dyY",
        authDomain: "clinicease-d1dc6.firebaseapp.com",
        projectId: "clinicease-d1dc6",
        storageBucket: "clinicease-d1dc6.appspot.com",
        messagingSenderId: "1013081124961",
        appId: "1:1013081124961:web:7067e669c5dd358a40ba20",
        measurementId: "G-1GFVSRLT9G"
};


console.log('Firebase connected successfully');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'serviceImages'
  });
}

// Get Firestore instance
const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();
const bucket = storage.bucket();

module.exports = { db, auth };
