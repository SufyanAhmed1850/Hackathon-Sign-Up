// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
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
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCyNUQxYkKfIXhgHeVO7I85tngmyjM7XRo",
    authDomain: "user-data-4b3a1.firebaseapp.com",
    projectId: "user-data-4b3a1",
    storageBucket: "user-data-4b3a1.appspot.com",
    messagingSenderId: "276932204866",
    appId: "1:276932204866:web:5952fe60377409d8de10db",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
onAuthStateChanged(auth, (user) => {
    if (user) {
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log("Uid ==>", uid);
    } else {
        console.log("User Signed Out");
    }
});
console.log("Firebase App ==>", app);
console.log("Auth ==>", auth);
console.log("DB ==>", db);

const toggleForm = (event) => {
    let btnText = event.target;
    let signInForm = document.getElementById("signInForm");
    let signUpForm = document.getElementById("signUpForm");
    let regText = document.getElementById("regText");
    let haveAccountText = document.getElementById("haveAccountText");
    let regOrLogText = document.querySelectorAll(".regOrLogText");
    regOrLogText.forEach((btn) => {
        btn.classList.remove("active-sign-head");
    });
    if (btnText.textContent === "Sign Up") {
        btnText.classList.add("active-sign-head");
        signInForm.classList.add("d-none");
        signUpForm.classList.remove("d-none");
        regText.textContent = "Log In";
        haveAccountText.textContent = "already";
    } else {
        btnText.classList.add("active-sign-head");
        signInForm.classList.remove("d-none");
        signUpForm.classList.add("d-none");
        regText.textContent = "Register";
        haveAccountText.textContent = "don’t";
    }
};
let regOrLogText = document.querySelectorAll(".regOrLogText");
regOrLogText.forEach((btn) => {
    btn.addEventListener("click", toggleForm);
});

const togglePass = (event) => {
    let eye = event.target;
    let input = eye.previousElementSibling;
    if (input.type == "password") {
        input.type = "text";
        eye.src = "./assets/invisible.svg";
        eye.previousElementSibling.focus();
    } else {
        input.type = "password";
        eye.src = "./assets/visible.svg";
        eye.previousElementSibling.focus();
    }
};
let passwordInput = document.querySelectorAll(
    'input.form-input[type="password"]'
);
passwordInput.forEach(function (input) {
    input.nextElementSibling.addEventListener("click", togglePass);
});

// const registerUser = async () => {

// };

let form = document.getElementById("signUpForm");
form.addEventListener("submit", async function (event) {
    let newFirstName = document.getElementById("newFirstName");
    let newLastName = document.getElementById("newLastName");
    let newEmail = document.getElementById("newEmail");
    let emailExistError = document.getElementById("emailExistError");
    let newPassword = document.getElementById("newPassword");
    let newConfirmPassword = document.getElementById("newConfirmPassword");
    let newPassMatchError = document.getElementById("newPassMatchError");
    let currentDate = new Date();
    currentDate = currentDate.toISOString();
    emailExistError.classList.add("d-none");
    if (newPassword.value !== newConfirmPassword.value) {
        newPassMatchError.classList.remove("v-hidden");
        return;
    }
    newPassMatchError.classList.add("v-hidden");

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            newEmail.value,
            newPassword.value
        );
        const user = userCredential.user;
        // Add a new document in collection "cities"
        await setDoc(doc(db, "users", user.uid), {
            firstName: newFirstName.value,
            lastName: newLastName.value,
            fullName: newFirstName.value + " " + newLastName.value,
            joined: currentDate,
        });
        console.log(user);
        newFirstName.value = "";
        newLastName.value = "";
        newEmail.value = "";
        newPassword.value = "";
        newConfirmPassword.value = "";
    } catch (error) {
        const errorMessage = error.message;
        console.log(error.code);
        if (error.code === "auth/email-already-in-use") {
            emailExistError.classList.remove("d-none");
        }
    }
});

const loginUser = async () => {
    console.log("Login");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let invalidUser = document.getElementById("invalidUser");
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            // Signed in
            invalidUser.classList.add("v-hidden");
            const user = userCredential.user;
            console.log(user);
        })
        .catch((error) => {
            invalidUser.classList.remove("v-hidden");
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            console.log(errorCode);
        });
};

let signInForm = document.getElementById("signInForm");
signInForm.addEventListener("submit", loginUser);

// let signInForm = document.getElementById("signInForm");
// signInForm.addEventListener("keydown", (event) => {
//     if (event.key === "Enter") {
//         loginUser();
//     }
// });

// window.showEmailWindow = (desc) => {
//     let emailWindow = document.getElementById("emailWindow");
//     let windowIcon = document.getElementById("windowIcon");
//     let emailErrorDesc = document.getElementById("emailErrorDesc");
//     let loginErrorDesc = document.getElementById("loginErrorDesc");
//     let passError = document.getElementById("passError");
//     let accCreated = document.getElementById("accCreated");
//     windowIcon.src = "./assets/danger.png";
//     passError.style.display = "none";
//     accCreated.style.display = "none";
//     emailWindow.style.display = "flex";
//     gsap.fromTo(
//         "#emailWindow",
//         {
//             y: -50,
//             opacity: 0,
//         },
//         {
//             y: 0,
//             opacity: 1,
//             ease: "power1.out",
//             duration: 0.4,
//         }
//     );
//     console.log(desc);
//     if (desc === "emailErrorDesc") {
//         emailErrorDesc.style.display = "block";
//         loginErrorDesc.style.display = "none";
//     } else if (desc === "wrong pass") {
//         emailErrorDesc.style.display = "none";
//         loginErrorDesc.style.display = "none";
//         passError.style.display = "block";
//     } else if (desc === "registered") {
//         windowIcon.src = "./assets/check.svg";
//         accCreated.style.display = "block";
//         emailErrorDesc.style.display = "none";
//         loginErrorDesc.style.display = "none";
//     } else {
//         emailErrorDesc.style.display = "none";
//         loginErrorDesc.style.display = "block";
//     }
//     setTimeout(() => {
//         gsap.fromTo(
//             "#emailWindow",
//             {
//                 y: 0,
//                 opacity: 1,
//             },
//             {
//                 y: -50,
//                 opacity: 0,
//                 ease: "power1.out",
//                 duration: 0.4,
//                 onComplete: function () {
//                     emailWindow.style.display = "none";
//                 },
//             }
//         );
//     }, 3500);
// };
