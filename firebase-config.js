// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAR2sGQx5Mxz_TZRfRyecWva346jBYel-8",
    authDomain: "chatapp-fa81d.firebaseapp.com",
    databaseURL: "https://chatapp-fa81d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chatapp-fa81d",
    storageBucket: "chatapp-fa81d.firebasestorage.app",
    messagingSenderId: "308333202130",
    appId: "1:308333202130:web:b9c4fc84eff5bb065f3b0b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();