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
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
let userLocal = JSON.parse(localStorage.getItem("userDb"));
let userUIDLocal = JSON.parse(localStorage.getItem("user"));
let headerRightLogin = document.getElementById("header-right-login");
userLocal
    ? (headerRightLogin.style.display = "none")
    : (headerRightLogin.style.display = "block");
let userNameElem = document.getElementById("userName");
userNameElem.textContent = userLocal.fullName;

let loader = document.querySelector("#loader");

const renderBlogs = async () => {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    querySnapshot.forEach((doc) => {
        const blogData = doc.data();
        console.log("Document data:", blogData);
        const allBlogsChild = document.querySelector(".all-blogs-child");
        const { text, fullName, title, date, userId, src } = blogData;
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
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = htmlTemplate;
        allBlogsChild.appendChild(tempDiv.firstElementChild);
    });
    loader.classList.add("d-none");
};
renderBlogs();

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

const signOutButton = document.getElementById("header-right-logout");

signOutButton.addEventListener("click", async () => {
    try {
        await signOut(auth);
        localStorage.clear();
        window.location.replace("../index.html");
        console.log("User signed out successfully.");
    } catch (error) {
        console.error("Error signing out:", error.message);
    }
});
