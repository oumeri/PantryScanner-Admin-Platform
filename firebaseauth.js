// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";;
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

//Firebase configuration
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

//Function that display messages to the user
function showMessage(message, divId){
    let messageDiv = document.getElementById(divId);
    messageDiv.style.display = 'block';
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function(){
        messageDiv.style.opacity = 0;
    },5000);
};

//Adding interactivity to the login button
const logIn = document.getElementById('logInButt');
logIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    //Initializing firebase authentication
    const auth = getAuth();
    //Initializing firestore
    const db = getFirestore();

    //Function that verifies credentials
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        showMessage('Processing...', 'logInMessage');
        const user = userCredential.user;

        //Saves the user's id locally
        localStorage.setItem('loggedInUserId', user.uid);
        //Adds the user's id to variable loggedInUser
        const loggedInUserId = localStorage.getItem('loggedInUserId');

        //Gets the document of the connected user from the profiles collection
        const docRef = doc(db,'profiles', loggedInUserId);
        getDoc(docRef)
        .then((docSnap) => {
            //Verifies if the document exists in the firestore database
            if(docSnap.exists()){
                //Retrieves the value of the field 'admin' inside the user's document
                const userCheck = docSnap.data().admin;
                if(userCheck === true){
                    showMessage('Logged in successfully', 'logInMessage');
                    window.location.href = '../public/items.html';
                }
                else{
                    showMessage('Incorrect Email or Password', 'logInMessage');
                }
            }
            else{
                showMessage('Incorrect Email or Password', 'logInMessage');
            }
        })
        .catch((e) => {
            showMessage('Incorrect Email or Password', 'logInMessage');
            console.log(e.message)
        });
        
    })
    .catch((e) => {
        const eCode = e.code;
        if(eCode === 'auth/invalid-credential'){
            showMessage('Incorrect Email or Password', 'logInMessage');
        }
    });
});