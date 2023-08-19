import app from "../config.js";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
import {
    getAuth,
    onAuthStateChanged,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    signOut,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);
let uid = null;
let user = null;
onAuthStateChanged(auth, (user) => {
    if (user) {
        uid = user.uid;
        user = user;
        console.log("Uid ==>", uid);
    } else {
        uid = null;
        console.log("User Signed Out");
    }
});

const inputFile = document.getElementById("imageInput");

const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
        const mountainsRef = ref(storage, `images/${uid}`);
        const uploadTask = uploadBytesResumable(mountainsRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                }
            },
            (error) => {
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
};

inputFile.addEventListener("change", async (event) => {
    try {
        let file = event.target.files[0];
        const res = await uploadFile(file);
        console.log("res-->", res);
        let img = document.getElementById("img");
        img.src = res;
    } catch (err) {
        console.log(err);
    }
});

// inputFile.addEventListener("change", async (event) => {
//     try {
//         if (!uid) {
//             console.log("User is not authenticated.");
//             return;
//         }
//         const file = event.target.files[0];
//         if (file) {
//             const storageRef = ref(storage, "images/" + uid);
//             await uploadBytesResumable(storageRef, file);
//             const imageURL = await getDownloadURL(storageRef);
//             console.log("Image URL:", imageURL);
//         }
//     } catch (error) {
//         console.error("Error:", error);
//     }
// });

const updatePassBtn = document.getElementById("updatePassBtn");
updatePassBtn.addEventListener("click", async () => {
    const oldPassword = document.getElementById("oldPass").value;
    const newPassword = document.getElementById("newPass").value;
    const repeatPassword = document.getElementById("RepeatPass").value;
    if (newPassword !== repeatPassword) {
        console.log("New passwords do not match.");
        return;
    }
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        console.log("Password updated successfully!");
        oldPassword.value = "";
        newPassword.value = "";
        repeatPassword.value = "";
    } catch (error) {
        console.error("Error updating password:", error.message);
    }
});

const signOutButton = document.getElementById("header-right-logout");

signOutButton.addEventListener("click", async () => {
    try {
        await signOut(auth);
        console.log("User signed out successfully.");
        if (!uid) {
            window.location.replace("../index.html");
        }
    } catch (error) {
        console.error("Error signing out:", error.message);
    }
});
