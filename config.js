import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCtPWyKIRMJsfWsLmwwlsArGw9788eQ8Sg",
    authDomain: "hackathonsmit-ba16c.firebaseapp.com",
    projectId: "hackathonsmit-ba16c",
    storageBucket: "hackathonsmit-ba16c.appspot.com",
    messagingSenderId: "420550745532",
    appId: "1:420550745532:web:772da6c2eb1e6442191fb9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
