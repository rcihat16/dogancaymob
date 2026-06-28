// ğŸ”— Firebase Connection Parameters and Initialization
    // ğŸ”— Firebase Connection Parameters
    const firebaseConfig = {
        apiKey: "AIzaSyAeGphNHF2187BaItx7lVReI006sCWUI04",
        authDomain: "dogancaymob.firebaseapp.com",
        projectId: "dogancaymob",
        storageBucket: "dogancaymob.firebasestorage.app",
        messagingSenderId: "1061997080500",
        appId: "1:1061997080500:web:5e813f760ddaca4b948ce1"
    };
    
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
window.db = db;