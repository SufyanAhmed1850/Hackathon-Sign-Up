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
    signOut,
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
// Check if the current page is allfromuser.html
if (window.location.href.endsWith("allfromuser.html")) {
    // Retrieve the button ID from local storage
    const buttonId = localStorage.getItem("buttonId");

    // Check if the button ID exists in local storage
    if (buttonId) {
        console.log("Button ID retrieved from local storage: " + buttonId);
        // You can use the buttonId variable as needed

        // Now fetch user data based on the retrieved uid
        const docRef = doc(db, "blogs", buttonId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            arr = userData.arr; // Assuming 'userData.arr' is an array of blog data
            const blogsFromUser = document.querySelector(
                ".all-blogs-from-user-child"
            );

            // Loop through each entry in the 'arr' array and create blog elements
            userData.arr.forEach((blogData) => {
                const { title, fullName, date, text, src } = blogData;

                // Create a new blog element
                const userBlog = document.createElement("div");
                userBlog.classList.add("all-blogs-from-user-blog");
                userBlog.innerHTML = `
                <div class="all-blogs-from-user-blog">
                <div class="all-blogs-from-user-blog-head">
                    <div class="all-blogs-from-user-blog-profile-image">
                        <img src="${src}" alt="Profile Picture">
                    </div>
                    <div class="all-blogs-from-user-blog-title">
                        <h2>${title}</h2>
                        <p>${fullName}</p>
                        <p>${date}</p>
                    </div>
                </div>
                <div class="all-blogs-from-user-blog-content">
                    <p>${text}</p>
                </div>
            </div>
                `;

                // Append the blog element to the parent container
                blogsFromUser.appendChild(userBlog);
            });
        } else {
            console.log("No such document!");
        }
    } else {
        console.log("Button ID not found in local storage.");
    }
}

// Get all the buttons with the class "see-all"
const buttons = document.querySelectorAll(".see-all");

// Add a click event listener to each button
buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
        // Get the ID of the clicked button
        const buttonId = event.target.id;

        // Save the button ID in local storage
        localStorage.setItem("buttonId", buttonId);

        console.log("Clicked button ID: " + buttonId);
        window.location.href = "/allfromuser.html";
    });
});

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
