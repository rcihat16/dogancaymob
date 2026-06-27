// js/firebase-config.js

const firebaseConfig = {
    apiKey: "AIzaSyAeGphNHF2187BaItx7lVReI006sCWUI04",
    authDomain: "dogancaymob.firebaseapp.com",
    projectId: "dogancaymob",
    storageBucket: "dogancaymob.firebasestorage.app",
    messagingSenderId: "1061997080500",
    appId: "1:1061997080500:web:5e813f760ddaca4b948ce1"
};

// Initialize Firebase using global window.firebase object
if (!window.firebase) {
    console.error("Firebase SDK script loading error: global 'firebase' object not found.");
} else if (!window.firebase.apps.length) {
    window.firebase.initializeApp(firebaseConfig);
}

export const db = window.firebase.firestore();
