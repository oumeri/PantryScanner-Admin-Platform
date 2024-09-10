// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, getDoc, doc, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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
  if(user){
    const docRef = doc(db, 'profiles', loggedInUserId);
    getDoc(docRef)
    .then((docSnap) => {
      if(docSnap.exists()){
        const userData = docSnap.data();
        document.getElementById('adminName').innerText = `${userData.firstName} ${userData.lastName}`;
      }
      else{
        console.log("No document found matching that id");
      };
    })
    .catch((e) => {
      console.log("An error occured while trying to get document");
    })
  }
  else{
    //Redirects to the login page if no credentials were provided
    console.log('NO USER');
    window.location.replace('../public/login.html')
  }
});

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

//Add an item to the db

//Variable for the add item container
const addItemContOriginal = document.getElementById('addItem').innerHTML;
//Create a ref to to the item's collection
const itemsCollectionRef = collection(db,'items');
//Verify if item exists or not by clicking on "Add item" button
const addItemButt = document.getElementById('addItemButt');
addItemButt.addEventListener('click', async (event) => {
    event.preventDefault();
    //Variables for the name and type fields
    let itemName = document.getElementById('itemName').value;
    let itemType = document.getElementById('itemType').value;
    if(!itemName || !itemType){
      showMessage('Please enter a name and a type', 'userMessage');
    }
    else{
      //Creating a query for the document where the name "itemName"
      const itemQuery = query(itemsCollectionRef, where('name', '==', itemName), where('type', '==', itemType));
      //Initialiaze the query
      const querySnap = await getDocs(itemQuery);
      //Verify if the item exists or not
      if(!querySnap.empty){
        showMessage('This item already exists', 'userMessage');
      }
      else{
        document.getElementById('addItem').innerHTML= `
          <p class="sTitle">Add a new item</p>
          <section class="inputs">
              <input id="itemFamily" type="text" placeholder="Family">
              <input id="itemCalories" type="text" placeholder="Calories">
              <input id="itemCarbs" type="text" placeholder="Carbohydrates">
              <input id="itemProtein" type="text" placeholder="Protein">
              <input id="itemFat" type="text" placeholder="Fat">
              <input id="itemSugar" type="text" placeholder="Sugar">
              <input id="itemTips" type="text" placeholder="Tips">
              <input id="itemValPeriodFridge" type="text" placeholder="Validity period (fridge)">
              <input id="itemValPeriodOut" type="text" placeholder="Validity period (pantry)">
              <button id="confirmItemButt" class="button">Confirm</button>
          </section>
        `
      };
    }
});

//Confirm adding the item to the db
document.getElementById('confirmItemButt').addEventListener('click', async (event) => {
  event.preventDefault();
  //Variables for the name and type fields
  const itemName = document.getElementById('itemName').value;
  const itemType = document.getElementById('itemType').value;
  //Create a ref to to the item's collection
  const itemsCollectionRef = collection(db,'items');
  //Variables for the info fields
  let family = document.getElementById('itemFamily').value;
  let calories = document.getElementById('itemCalories').value;
  let carbs = document.getElementById('itemCarbs').value;
  let protein = document.getElementById('itemProtein').value;
  let fat = document.getElementById('itemFat').value;
  let sugar = document.getElementById('itemSugar').value;
  let tips = document.getElementById('itemTips').value;
  let valPeriodFridge = document.getElementById('itemValPeriodFridge').value;
  let valPeriodOut = document.getElementById('itemValPeriodOut').value;
  //Adding a new document for the item in the db
  try{
    await addDoc(itemsCollectionRef, {
      family: family,
      name: itemName,
      type: itemType,
      calories: calories,
      carbohydrates: carbs,
      fat: fat,
      protein: protein,
      sugar: sugar,
      tips: tips,
      fridge: valPeriodFridge,
      pantry: valPeriodOut,
    });
    showMessage('Item added successfully', 'userMessage');
    document.getElementById('addItem').innerHTML = addItemContOriginal;

  }
  catch (e){
    showMessage('A problem occured when adding the item, please try again', 'userMessage');
    console.log(e.message);
  };
});
