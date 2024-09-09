// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";;
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
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
//Initialize the auhtentication service
const auth = getAuth();
//Initialize firestore
const db = getFirestore();

//Listening to the auth state of the user
onAuthStateChanged(auth, (user) => {
  const loggedInUserId = localStorage.getItem('loggedInUserId');
  if(loggedInUserId){
    const docRef = doc(db, 'profiles', loggedInUserId);
    getDoc(docRef)
    .then((docSnap) => {
      if(docSnap.exists()){
        const userData = docSnap.data();
        document.getElementById('adminName').innerText = `${userData.firstName} ${userData.lastName}`;
      }
      else{
        console.log("No document found matching that id");
      }
    })
    .catch((e) => {
      console.log("An error occured while trying to get document");
    })
  }
  else{
    console.log("No user id was found in the local storage");
  }
});

//Log out function
const logOutButt = document.getElementById('logOutButt');
logOutButt.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(() => {
      window.location.href = '../public/login.html';
    })
    .catch((e) => {
      console.log('Error sign out: ', e);
    })
});
