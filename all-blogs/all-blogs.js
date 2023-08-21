import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
const firebaseConfig = {
    apiKey: "AIzaSyCtPWyKIRMJsfWsLmwwlsArGw9788eQ8Sg",
    authDomain: "hackathonsmit-ba16c.firebaseapp.com",
    projectId: "hackathonsmit-ba16c",
    storageBucket: "hackathonsmit-ba16c.appspot.com",
    messagingSenderId: "420550745532",
    appId: "1:420550745532:web:772da6c2eb1e6442191fb9",
};

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    Timestamp,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
let userLocal = JSON.parse(localStorage.getItem("userDb"));
let userUIDLocal = JSON.parse(localStorage.getItem("user"));

// Fetch all documents in the "blogs" collection
const querySnapshot = await getDocs(collection(db, "blogs"));

querySnapshot.forEach((doc) => {
    // Access each document's data
    const blogData = doc.data();
    // Process each document's data here
    console.log("Document data:", blogData);
    console.log(doc.data().arr);
    // Assuming doc.data().arr is your array of objects
    const arr = doc.data().arr;

    // Get a reference to the parent div
    const allBlogsChild = document.querySelector(".all-blogs-child");

    // Loop through the array and append HTML elements for each object
    arr.forEach((item) => {
        const { text, fullName, title, date, userId, src } = item;

        // Create a template literal with the HTML structure
        const htmlTemplate = `
        <div class="all-blogs-blog">
            <div class="all-blogs-blog-head">
                <div class="all-blogs-blog-profile-image">
                    <img src="${src}" alt="Profile Picture">
                </div>
                <div class="all-blogs-blog-title">
                    <h2>${title}</h2>
                    <p>${fullName}</p>
                    <p>${date}</p>
                </div>
            </div>
            <div class="all-blogs-blog-content">
                <p>${text}</p>
            </div>
            <div class="blog-edit">
                <button id="${userId}" class="see-all">See all from this user</button>
            </div>
        </div>
    `;

        // Create a temporary div element to hold the template literal
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = htmlTemplate;

        // Append the template to the parent div
        allBlogsChild.appendChild(tempDiv.firstElementChild);
    });
});

// Greeting according to time of day

window.getGreeting = function () {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    let greeting = "";

    if (currentHour >= 5 && currentHour < 12) {
        greeting = "Good morning";
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }

    return greeting;
};

if (window.location.pathname === "/allblogs.html") {
    const greeting = getGreeting();
    console.log(`${greeting} Readers!`);

    let greetingHead = document.getElementById("greeting");
    greetingHead.textContent = greeting;
}
