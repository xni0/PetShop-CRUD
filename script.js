/**
 * Pet Store Management with Local Storage
 * Developed by: Lucilene Vidal Lima
 * Practice: P7.1
 */

// It's an empty array that acts as my temporary "database."
let pets = [];

// these are "state variables" or "flags"
// Help us know if we are adding or editing a pet
let isEditing = false;
let currentEditId = null; // Store the ID of the pet we are editing

// Get all the form inputs from the HTML
const petForm = document.getElementById('petForm');
const petNameInput = document.getElementById('petName');
const petDescInput = document.getElementById('petDesc');
const petImageInput = document.getElementById('petImage');
const petBirthdateInput = document.getElementById('petBirthdate');
const petPriceInput = document.getElementById('petPrice');
const petCodeInput = document.getElementById('petCode');
const petSoldInput = document.getElementById('petSold');
const addBtn = document.getElementById('addBtn');

// Get the container for the pet list
const petListContainer = document.getElementById('petListContainer');

/**
 * Checks LocalStorage for data.
 * If empty, loads initial dummy data.
 * If exists, parses JSON to pets array.
 */
function initPets() {
    const storedPets = localStorage.getItem('petStore_data');

    if (storedPets) {
        // If data exists in storage, use it
        pets = JSON.parse(storedPets);
    } else {
        // If NO data exists (first time load), add dummy pets
        pets = [
            {
                id: 1700000000001,
                name: "Luna",
                description: "A friendly golden retriever.",
                imageUrl: "https://images.dog.ceo/breeds/retriever-golden/n02099601_10.jpg",
                birthdate: "2020-05-15",
                price: 150.00,
                petCode: "DOG001",
                isSold: false
            },
            {
                id: 1700000000002,
                name: "Felix",
                description: "Lazy but cute cat.",
                imageUrl: "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg",
                birthdate: "2021-08-10",
                price: 80.50,
                petCode: "CAT002",
                isSold: true
            }
        ];
        // Save these initial pets to storage immediately
        saveToLocalStorage();
    }
    // Draw the list
    renderPets();
}

/**
 * Saves the current 'pets' array to LocalStorage
 * Must be called whenever the array changes (Add, Edit, Delete)
 */
function saveToLocalStorage() {
    localStorage.setItem('petStore_data', JSON.stringify(pets));
}

/**
 * Clears the list and LocalStorage
 * Connected to the new button in HTML
 */
function clearAllPets() {
    if (confirm('Are you sure you want to delete ALL pets? This cannot be undone.')) {
        pets = []; // Empty the array
        localStorage.removeItem('petStore_data'); // Clear storage
        renderPets(); // Re-draw (empty list)
    }
}

// Event Listeners 

// When the user tries to submit it (by clicking the 'Add Pet' button), 
// stop the default page reload and instead, run my function named handleFormSubmit."
petForm.addEventListener('submit', handleFormSubmit);


// Functions

/**
 * This function runs when the form is submitted
 * It validates data and decides to ADD or UPDATE a pet.
 */
function handleFormSubmit(event) {
    // Stops the browser from reloading on form submit
    // because we want to handle it with JavaScript
    event.preventDefault();

    // Get all the values from the form
    // reads whatever the user typed into the form fields
    const name = petNameInput.value;
    const description = petDescInput.value;
    const imageUrl = petImageInput.value;
    const birthdate = petBirthdateInput.value;
    const price = petPriceInput.value; 
    const petCode = petCodeInput.value;
    const isSold = petSoldInput.checked; 

    //  Validation 
    // 1. Check for empty fields
    if (!name || !description || !imageUrl || !birthdate || !price || !petCode) {
        alert('Please fill in all fields!');
        return; // Stop the function
    }

    // 2. Validate Image URL
    // if the url does not end with .jpg, .png, or .gif 
    // show an alert and stop the function
    const urlRegex = /\.(jpeg|jpg|gif|png)$/i; 
    if (!urlRegex.test(imageUrl)) {
        alert('Please enter a valid image URL (must end in .jpg, .png, or .gif)');
        return;
    }

    // 3. Validate Birthdate
    // Birthdate cannot be in the future
    // Get today's date and compare
    // if birthdate > today, show alert and stop function
    const today = new Date();
    const birthDateObj = new Date(birthdate);
    if (birthDateObj > today) {
        alert('Birthdate cannot be in the future!');
        return;
    }

    // 4. Validate Price
    // Price must be a positive number
    // Convert price to a number and check if it's > 0
    const priceNum = parseFloat(price); 
    if (priceNum <= 0) {
        alert('Price must be a positive number!');
        return;
    }

    // 5. Validate Pet Code
    // Pet Code must be 3 letters followed by 3 numbers (e.g., CAT123)
    // Use a regular expression to check the format
    // The 'i' at the end makes it case-insensitive
    const codeRegex = /^[A-Z]{3}[0-9]{3}$/i; 
    if (!codeRegex.test(petCode)) {
        alert('Pet Code must be 3 letters followed by 3 numbers (e.g., CAT123)');
        return;
    }
    //  End Validation 


    // Check if we are editing or adding a new pet

    // the variable isEditing is a flag that tells us the mode
    // If we are editing, update the existing pet
    // If we are adding, create a new pet object

    // Run only if is editing is true
    // This flag gets set to true when the user clicks 'Edit' on a pet card
    if (isEditing) {
        //  UPDATE PET

        // Search the array of pets to find the one we are editing
        const petIndex = pets.findIndex(pet => pet.id === currentEditId);
        // Update the pet's data
        
        // using the index we found
        // and the new values from the form
        // Update each property
        // of the pet object at that index
        // with the new values from the form
        pets[petIndex].name = name;
        pets[petIndex].description = description;
        pets[petIndex].imageUrl = imageUrl;
        pets[petIndex].birthdate = birthdate;
        pets[petIndex].price = priceNum;
        pets[petIndex].petCode = petCode;
        pets[petIndex].isSold = isSold;

        // Reset the form and editing state
        // so we set the flag back to false
        isEditing = false;
        // clear the current edit ID
        // so we are not accidentally editing again
        currentEditId = null;
        // Change button text back to 'Add Pet'
        addBtn.textContent = 'Add Pet';

    } else {
        //  TO ADD A NEW PET 

        // Create a new pet object with a unique ID
        // Date.now() gives us a unique timestamp
        // I use that as the ID for simplicity
        // because we don't have a database to generate IDs
        // (It gives the new pet a unique ID by using the current time in milliseconds)
        const newPet = {
            id: Date.now(), 
            name: name,
            description: description,
            imageUrl: imageUrl,
            birthdate: birthdate,
            price: priceNum,
            petCode: petCode,
            isSold: isSold
        };
        // Add the new pet to the end of the pets array
        pets.push(newPet);
    }
    
    saveToLocalStorage();
    // Re-draw all pets on the page
    // whether we added or updated
    // to force the changes to show
    renderPets();

    // Clear the form fields
    // making it obvious that the submission was successful
    // and ready for a new entry
    clearForm();
}


// This function clears all form inputs

function clearForm() {
    petNameInput.value = '';
    petDescInput.value = '';
    petImageInput.value = '';
    petBirthdateInput.value = '';
    petPriceInput.value = '';
    petCodeInput.value = '';
    petSoldInput.checked = false;
}


 // This function draws all pets into the page
 // It deletes everything and re-adds it.

function renderPets() {
    // Clear the entire list container
    // It prevents the page from showing duplicate cards 
    // every time you add, edit, or delete a pet
    petListContainer.innerHTML = '';

    // Loop through every pet in our 'pets' array
    // and create an HTML card for each one
    for (const pet of pets) {
        
        // Create Sold Badge 
        // start in a empty string because it may not be used
        let soldBadgeHtml = ''; // Must use 'let' because it will change
        if (pet.isSold === true) { 
            // changes the variable if the pet is sold
            soldBadgeHtml = '<div class="sold-badge">SOLD</div>';
        }

        // Create Sold Class for Pet Card
        let soldClass = ''; 
        if (pet.isSold) {
            // take the variable and assign a class name
            soldClass = 'is-sold';
        }

        // Create the HTML string for the pet card
        const petCardHtml = `
            <div class="pet-card ${soldClass}" data-id="${pet.id}">
                ${soldBadgeHtml}
                <img src="${pet.imageUrl}" alt="${pet.name}">
                <h4>${pet.name}</h4>
                <p><strong>Code:</strong> ${pet.petCode}</p>
                <p><strong>Born:</strong> ${pet.birthdate}</p>
                <p><strong>Price:</strong> $${pet.price.toFixed(2)}</p>
                <p>${pet.description}</p>
                
                <div class="buttons">
                    <button class="btn-edit" onclick="editPet(${pet.id})">Edit</button>
                    <button class="btn-delete" onclick="deletePet(${pet.id})">Delete</button>
                    <button class="btn-toggle-sold" onclick="toggleSold(${pet.id})">Toggle Sold</button>
                </div>
            </div>
        `;

        // Add the new HTML string to the container
        petListContainer.innerHTML += petCardHtml;
    }
}


//  Deletes a pet when the 'Delete' button is clicked
//  This function is global so 'onclick' can find it

function deletePet(id) {
    // Confirm deletion with the user
    if (confirm('Are you sure you want to delete this pet?')) {
        // Re-create the array without the pet
        pets = pets.filter(pet => pet.id !== id);
        saveToLocalStorage();
        // Re-draw the list
        renderPets();
    }
}


// Toggles the 'isSold' status of a pet
function toggleSold(id) {
    // Find the pet
    const pet = pets.find(p => p.id === id);
    // Flip the boolean value
    pet.isSold = !pet.isSold;
    saveToLocalStorage();
    // Re-draw the list
    renderPets();
}


// Fills the form with a pet's data to be edited
function editPet(id) {
    // Find the pet by ID
    const pet = pets.find(p => p.id === id);

    // Fill the form inputs
    // with the new values from the pet object
    // so the user can see and edit them
    petNameInput.value = pet.name;
    petDescInput.value = pet.description;
    petImageInput.value = pet.imageUrl;
    petBirthdateInput.value = pet.birthdate;
    petPriceInput.value = pet.price;
    petCodeInput.value = pet.petCode;
    petSoldInput.checked = pet.isSold;

    // Set my global "flag" variable isEditing to true
    // so when the form is submitted, we know to update
    // and not add a new pet
    isEditing = true;
    // Store the current pet ID being edited
    // so we know which pet to update on submit
    currentEditId = id;

    // Change button text from "Add Pet" to "Update Pet"
    addBtn.textContent = 'Update Pet';

}

// Initialize the app by loading pets from LocalStorage
initPets();