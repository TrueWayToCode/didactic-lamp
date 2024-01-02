// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwt1t-vLo9H7bcSoLB_7t5PijqbQltVho",
  authDomain: "final-year-79f39.firebaseapp.com",
  projectId: "final-year-79f39",
  storageBucket: "final-year-79f39.appspot.com",
  messagingSenderId: "256826605326",
  appId: "1:256826605326:web:efc129d5562cbd29a2615f"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const submitButton = document.getElementById("submit");
const signupButton = document.getElementById("sign-up");
const forgotPasswordButton = document.getElementById("forgot-password");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const main = document.getElementById("main");
const createacct = document.getElementById("create-acct");

const signupUsernameIn = document.getElementById("username-signup");
const signupEmailIn = document.getElementById("email-signup");
const confirmSignupEmailIn = document.getElementById("confirm-email-signup");
const signupPasswordIn = document.getElementById("password-signup");
const confirmSignUpPasswordIn = document.getElementById("confirm-password-signup");
const roleSignupSelect = document.getElementById("role-signup");
const createacctbtn = document.getElementById("create-acct-btn");

const returnBtn = document.getElementById("return-btn");

var email, password, signupEmail, signupPassword, confirmSignupEmail, confirmSignUpPassword, signupUsername;

forgotPasswordButton.addEventListener("click", function () {
  email = emailInput.value;

  if (email) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        window.alert('Password reset email sent. Check your email for instructions.');
      })
      .catch((error) => {
        console.error(error.message);
        window.alert('Failed to send password reset email. Please try again.');
      });
  } else {
    window.alert('Please enter your email before requesting a password reset.');
  }
});

createacctbtn.addEventListener("click", function () {
  var isVerified = true;

  signupUsername = signupUsernameIn.value;
  signupEmail = signupEmailIn.value;
  confirmSignupEmail = confirmSignupEmailIn.value;
  if (signupEmail !== confirmSignupEmail) {
    window.alert("Email fields do not match. Try again.");
    isVerified = false;
  }

  signupPassword = signupPasswordIn.value;
  confirmSignUpPassword = confirmSignUpPasswordIn.value;
  if (signupPassword !== confirmSignUpPassword) {
    window.alert("Password fields do not match. Try again.");
    isVerified = false;
  }

  const selectedRoleSignup = roleSignupSelect.value;

  if (!selectedRoleSignup || signupUsername == null || signupEmail == null || confirmSignupEmail == null || signupPassword == null || confirmSignUpPassword == null) {
    window.alert("Please fill out all required fields.");
    isVerified = false;
  }

  if (isVerified) {
    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .then((userCredential) => {
        const user = userCredential.user;

        // Store user information in Firestore
        const usersCollection = collection(db, 'users');

        addDoc(usersCollection, {
          uid: user.uid,
          email: signupEmail,
          username: signupUsername,
          role: selectedRoleSignup
        });

        // Set custom claims for role-based authentication
        return user.getIdTokenResult()
          .then(idTokenResult => auth.setCustomUserClaims(user.uid, { role: selectedRoleSignup }));
      })
      .then(() => {
        window.alert(`Success! Account created for ${signupUsername}.`);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert("Error occurred. Try again.");
      });
  }
});

submitButton.addEventListener("click", function () {
  email = emailInput.value;
  password = passwordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Get user claims to check the role
      return user.getIdTokenResult();
    })
    .then((idTokenResult) => {
      const role = idTokenResult.claims.role;

      console.log("Success! Welcome back!");

      // Now you can check the role and redirect or show/hide features accordingly
      if (role === 'manufacturer') {
        // Redirect or show features for the manufacturer
      } else if (role === 'retailer') {
        // Redirect or show features for the retailer
      } else if (role === 'consumer') {
        // Redirect or show features for the consumer
      } else if (role === 'distributor') {
        // Redirect or show features for the distributor
      } else {
        // Handle other roles or default case
      }

      window.alert("Success! Welcome back!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error occurred. Try again.");
      window.alert("Error occurred. Try again.");
    });
});

signupButton.addEventListener("click", function () {
  main.style.display = "none";
  createacct.style.display = "block";
});

returnBtn.addEventListener("click", function () {
  main.style.display = "block";
  createacct.style.display = "none";
});
