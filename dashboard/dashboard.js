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
    onSnapshot,
    orderBy,
    query,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
let userDbLocal = JSON.parse(localStorage.getItem("userDb"));
let userLocal = JSON.parse(localStorage.getItem("user"));
let userNameElem = document.getElementById("userName");
userNameElem.textContent = userDbLocal.fullName;
let loader = document.querySelector("#loader");

let indexToDelete;
// let idToEdit = {};
let toEdit = {};
let uid = userLocal.uid;
let arr = [];

const rederDashboard = async () => {
    const docRef = await doc(db, "blogs", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const userData = await docSnap.data();
        arr = await docSnap.data().arr;
        // Assuming 'userData.arr' is an array of blog data
        const blogParent = document.querySelector(".blog-parent");
        userData.arr.forEach((blogData) => {
            const { title, fullName, date, text, src, postId } = blogData;
            // Create a new blog element
            const blog = document.createElement("div");
            blog.classList.add("blog");
            blog.innerHTML = `
                        <div class="blog-head">
                            <div class="blog-profile-image">
                                <img src="${src}" alt="Profile Picture">
                            </div>
                            <div class="blog-title">
                                <h2>${title}</h2>
                                <p>${fullName}</p>
                                <p>${date}</p>
                            </div>
                        </div>
                        <div class="blog-content">
                            <p>${text}</p>
                        </div>
                        <div class="blog-edit">
                            <button class="delete-button" data-id="${postId}">Delete</button>
                            <button class="edit-button" data-id="${postId}">Edit</button>
                        </div>
                    `;
            blogParent.appendChild(blog);
        });
    } else {
        console.log("No such document!");
        arr = [];
    }

    let deleteButton = document.querySelectorAll(".delete-button");
    deleteButton.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            let c = confirm("Are you sure you want to delete this?");
            if (c) {
                const idToDelete = e.target.getAttribute("data-id");
                arr = arr.filter((a) => a.postId != idToDelete);
                const dataToSend = {
                    arr: arr,
                };
                await setDoc(doc(db, "blogs", userLocal.uid), dataToSend)
                    .then(() => {
                        console.log(
                            "Document successfully written to Firestore!"
                        );
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            }
        });
    });

    let editButton = document.querySelectorAll(".edit-button");
    editButton.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            let editWindow = document.getElementById("edit-window");
            editWindow.style.display = "block";
            const idToEdit = e.target.getAttribute("data-id");
            toEdit = arr.find((a) => a.postId == idToEdit);
            document.getElementById("editTitle").value = toEdit.title;
            document.getElementById("editBlog").value = toEdit.text;
            arr = arr.filter((a) => a.title !== idToEdit);
        });
    });

    let saveBtn = document.querySelectorAll(".save-btn");
    saveBtn.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            toEdit.title = document.getElementById("editTitle").value;
            toEdit.text = document.getElementById("editBlog").value;
            console.log(toEdit);
            arr.push(toEdit);
            const dataToSend = {
                arr: arr,
            };
            setDoc(doc(db, "blogs", userLocal.uid), dataToSend)
                .then(() => {
                    console.log("Document successfully written to Firestore!");
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            let editWindow = document.getElementById("edit-window");
            editWindow.style.display = "none";
        });
    });

    const editWindow = () => {
        document.getElementById("edit-window").style.display = "none";
    };
    document.querySelectorAll(".cancel-btn").forEach((btn) => {
        btn.addEventListener("click", editWindow);
    });
    loader.classList.add("d-none");
};
rederDashboard();

// Get current Date for blog entry
const getCurrentDateFormatted = () => {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    // Function to add the appropriate suffix for the day
    function getDayWithSuffix(day) {
        if (day >= 11 && day <= 13) {
            return `${day}th`;
        }
        switch (day % 10) {
            case 1:
                return `${day}st`;
            case 2:
                return `${day}nd`;
            case 3:
                return `${day}rd`;
            default:
                return `${day}th`;
        }
    }
    const formattedDate = `${month} ${getDayWithSuffix(day)}, ${year}`;
    return formattedDate;
};

// Function to publish blog
let userSrc = null;
let blogsObj = {};
const publishBlog = async () => {
    loader.classList.remove("d-none");
    const docRef = await doc(db, "users", userLocal.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const userData = await docSnap.data();
        userSrc = userData.src;
        console.log("User Data:", userData);
    } else {
        console.log("No such document!");
    }
    const currentDateFormatted = getCurrentDateFormatted();
    console.log(currentDateFormatted);
    const ref = doc(db, "postId", "id");
    // Fetch the current data
    const snap = await getDoc(ref);
    const dbData = snap.data();
    const newId = dbData.id + 1;
    await setDoc(ref, { id: newId })
        .then(() => {
            console.log("Document successfully updated in Firestore!");
            window.location.reload();
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });
    let blogTitle = document.getElementById("publishBlogTitle").value;
    let blogText = document.getElementById("publishBlogContent").value;
    console.log(blogTitle, blogText);
    let blogParent = document.querySelector(".blog-parent");
    let blog = document.createElement("div");
    blog.classList.add("blog");
    blog.innerHTML = `
                        <div class="blog-head">
                            <div class="blog-profile-image">
                                <img src="${userSrc}" alt="Profile Picture">
                            </div>
                            <div class="blog-title">    
                                <h2>${blogTitle}</h2>
                                <p>${userDbLocal.fullName}</p>
                                <p>${currentDateFormatted}</p>
                            </div>
                        </div>
                        <div class="blog-content">
                            <p>${blogText}</p>
                        </div>
                        <div class="blog-edit">
                            <button class="delete-button" data-id="${newId}">Delete</button>
                            <button class="edit-button" data-id="${newId}">Edit</button>
                        </div>
    `;
    blogParent.prepend(blog);
    let blogObject = {
        fullName: userDbLocal.fullName,
        date: currentDateFormatted,
        title: blogTitle,
        text: blogText,
        postId: newId,
        userId: uid,
        src: userSrc,
        timestamp: new Date().getTime(),
    };
    arr.push(blogObject);
    console.log(arr);
    const dataToSend = {
        arr: arr,
    };
    setDoc(doc(db, "blogs", userLocal.uid), dataToSend)
        .then(() => {
            console.log("Document successfully written to Firestore!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    document.getElementById("publishBlogTitle").value = "";
    document.getElementById("publishBlogContent").value = "";
};

let publishBtn = document.getElementById("publishBlogButton");
publishBtn.addEventListener("submit", publishBlog);

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
