// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, getDoc, doc, collection, query, where, getDocs, addDoc, limit } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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
    const itemName = document.getElementById('itemName').value;
    localStorage.setItem('itemNameStore', itemName)
    const itemType = document.getElementById('itemType').value;
    localStorage.setItem('itemTypeStore', itemType);
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


// Attach the event listener to the parent container (addItem) instead of the button itself
document.getElementById('addItem').addEventListener('click', async (event) => {
  // Check if the click event is coming from the confirmItemButt button
  if (event.target && event.target.id === 'confirmItemButt') {
    event.preventDefault();
    //Variables for the name and type fields
    const itemName = localStorage.getItem('itemNameStore');
    const itemType = localStorage.getItem('itemTypeStore');
    //Create a ref to to the item's collection
    const itemsCollectionRef = collection(db,'items');
    //Variables for the info fields
    const family = document.getElementById('itemFamily').value;
    const calories = parseFloat(document.getElementById('itemCalories').value);
    const carbs = parseFloat(document.getElementById('itemCarbs').value);
    const protein = parseFloat(document.getElementById('itemProtein').value);
    const fat = parseFloat(document.getElementById('itemFat').value);
    const sugar = parseFloat(document.getElementById('itemSugar').value);
    const tips = document.getElementById('itemTips').value;
    const valPeriodFridge = document.getElementById('itemValPeriodFridge').value;
    const valPeriodOut = document.getElementById('itemValPeriodOut').value;
    //Adding a new document for the item in the db
    try{
      await addDoc(itemsCollectionRef, {
        family: family,
        name: itemName,
        type: itemType,
        nutrition_facts:{
          calories: calories,
          carbohydrates: carbs,
          fat: fat,
          protein: protein,
          sugar: sugar,
        },
        validity_period:{
          fridge: valPeriodFridge,
          pantry: valPeriodOut,
        },
        tips: tips,
      });
      showMessage('Item added successfully', 'userMessage');
      document.getElementById('addItem').innerHTML = addItemContOriginal;
    }
    catch (e){
      showMessage('A problem occured when adding the item, please try again', 'userMessage');
      console.log(e.message);
    };
  }
});

//Searching for an item by name

document.getElementById('searchItem').addEventListener('keydown', async (event) => {
  if(event.key == 'Enter'){
    event.preventDefault();
    //A variable for the name typed by the user
    const searchedItemName = document.getElementById('searchedItem').value;
    //Initialzie a query for the searched item
    const itemQuery = query(itemsCollectionRef, where('name', '==', searchedItemName));
    //Querying the specified document
    const querySnap = await getDocs(itemQuery);
    //Verify if the document exists or not
    if(!querySnap.empty){
      querySnap.forEach((doc) => {
        const itemData = doc.data();
        console.log(itemData);
      })
    }
    else{
      showMessage('Item not found', 'userMessage');
    }
    console.log(searchedItemName);
  }
})

//Displaying the last added items
//Collecting the name and type of the 5 last added items
try{
  const itemQuery = query(itemsCollectionRef, limit(5));
  const querySnap  = await getDocs(itemQuery);
  //Array of the item's data
  const itemsData = [];
  querySnap.forEach((doc) => {
      itemsData.push(doc.data());
  });
  //Display the name and type on the cards
  const itemCards = document.querySelectorAll('.item');
  // Hide extra item cards
  for (let i = itemsData.length; i < itemCards.length; i++) {
    itemCards[i].style.display = 'none';
  }
  itemsData.forEach((item, index) => {
    if (index < itemCards.length) {
      const itemCard = itemCards[index];
      // Update the name and type
      itemCard.querySelector('.typeInfo #name').textContent = item.name;
      itemCard.querySelector('.typeInfo #type').textContent = item.type;
    } 
  });
}
catch(e){
  console.log(e.message);
};




