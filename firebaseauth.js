// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";;
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBAMoXXWgjghBDnzxJG3umZ5JXUP38SgdY",
  authDomain: "pantryscanner-dca28.firebaseapp.com",
  projectId: "pantryscanner-dca28",
  storageBucket: "pantryscanner-dca28.appspot.com",
  messagingSenderId: "914243259256",
  appId: "1:914243259256:web:5b285ca23a18c96526d68d",
  measurementId: "G-0BDNC80FND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function showMessage(message, divId){
    let messageDiv = document.getElementById(divId);
    messageDiv.style.display = 'block';
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function(){
        messageDiv.style.opacity = 0;
    },5000);
};

const logIn = document.getElementById('logInButt');
logIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const auth = getAuth();
    const db = getFirestore();

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        showMessage('login is successfulm', 'logInMessage');
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = '../public/items.html';
    })
    .catch((e) => {
        const eCode = e.code;
        if(eCode === 'auth/invalid-credential'){
            showMessage('Incorrect Email or Password', 'logInMessage');
        }
    });
});