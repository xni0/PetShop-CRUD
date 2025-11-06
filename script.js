
//  Global Variables 
// This is our in-memory "database"
let pets = [];

// Track if we are editing a pet
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


// Event Listeners 
// Wait for the form to be submitted
petForm.addEventListener('submit', handleFormSubmit);


// Functions

/**
 * This function runs when the form is submitted
 * It validates data and decides to ADD or UPDATE a pet.
 */
function handleFormSubmit(event) {
    // Stop the page from reloading
    event.preventDefault();

    // Get all the values from the form
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
    const urlRegex = /\.(jpeg|jpg|gif|png)$/i; 
    if (!urlRegex.test(imageUrl)) {
        alert('Please enter a valid image URL (must end in .jpg, .png, or .gif)');
        return;
    }

    // 3. Validate Birthdate
    const today = new Date();
    const birthDateObj = new Date(birthdate);
    if (birthDateObj > today) {
        alert('Birthdate cannot be in the future!');
        return;
    }

    // 4. Validate Price
    const priceNum = parseFloat(price); 
    if (priceNum <= 0) {
        alert('Price must be a positive number!');
        return;
    }

    // 5. Validate Pet Code
    const codeRegex = /^[A-Z]{3}[0-9]{3}$/i; 
    if (!codeRegex.test(petCode)) {
        alert('Pet Code must be 3 letters followed by 3 numbers (e.g., CAT123)');
        return;
    }
    //  End Validation 


    // Check if we are editing or adding a new pet
    if (isEditing) {
        // --- UPDATE PET ---
        const petIndex = pets.findIndex(pet => pet.id === currentEditId);
        pets[petIndex].name = name;
        pets[petIndex].description = description;
        pets[petIndex].imageUrl = imageUrl;
        pets[petIndex].birthdate = birthdate;
        pets[petIndex].price = priceNum;
        pets[petIndex].petCode = petCode;
        pets[petIndex].isSold = isSold;

        // Reset the form and editing state
        isEditing = false;
        currentEditId = null;
        addBtn.textContent = 'Add Pet';

    } else {
        // --- ADD NEW PET ---
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
        pets.push(newPet);
    }
    
    // Re-draw all pets on the page
    renderPets();

    // Clear the form fields
    clearForm();
}

/**
 * This function clears all form inputs
 */
function clearForm() {
    petNameInput.value = '';
    petDescInput.value = '';
    petImageInput.value = '';
    petBirthdateInput.value = '';
    petPriceInput.value = '';
    petCodeInput.value = '';
    petSoldInput.checked = false;
}

/**
 * This function draws all pets onto the page
 * It deletes everything and re-adds it.
 */
function renderPets() {
    // Clear the entire list container
    petListContainer.innerHTML = '';

    // Loop through every pet in our 'pets' array
    for (const pet of pets) {
        
        // Create Sold Badge 
        const soldBadgeHtml = pet.isSold ? '<div class="sold-badge">SOLD</div>' : '';
        const soldClass = pet.isSold ? 'is-sold' : '';

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

/**
 * Deletes a pet when the 'Delete' button is clicked
 * This function is global so 'onclick' can find it
 */
function deletePet(id) {
    if (confirm('Are you sure you want to delete this pet?')) {
        // Re-create the array without the pet
        pets = pets.filter(pet => pet.id !== id);
        // Re-draw the list
        renderPets();
    }
}

/**
 * Toggles the 'isSold' status of a pet
 */
function toggleSold(id) {
    // Find the pet
    const pet = pets.find(p => p.id === id);
    // Flip the boolean value
    pet.isSold = !pet.isSold;
    // Re-draw the list
    renderPets();
}

/**
 * Fills the form with a pet's data to be edited
 */
function editPet(id) {
    // Find the pet
    const pet = pets.find(p => p.id === id);

    // Fill the form inputs
    petNameInput.value = pet.name;
    petDescInput.value = pet.description;
    petImageInput.value = pet.imageUrl;
    petBirthdateInput.value = pet.birthdate;
    petPriceInput.value = pet.price;
    petCodeInput.value = pet.petCode;
    petSoldInput.checked = pet.isSold;

    // Set editing flags
    isEditing = true;
    currentEditId = id;

    // Change button text
    addBtn.textContent = 'Update Pet';

    // Scroll to the top to see the form
    window.scrollTo(0, 0);
}

// Initial render (draws an empty list)
renderPets();