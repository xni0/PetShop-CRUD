// Global Variables 
// This is our in-memory "database"
let pets = [];

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

// Event Listeners 
// Wait for the form to be submitted
petForm.addEventListener('submit', handleFormSubmit);


// Functions

function handleFormSubmit(event) {
    event.preventDefault();

    const name = petNameInput.value;
    const description = petDescInput.value;
    const imageUrl = petImageInput.value;
    const birthdate = petBirthdateInput.value;
    const price = petPriceInput.value; 
    const petCode = petCodeInput.value;
    const isSold = petSoldInput.checked; 

    // --- Validation ---
    if (!name || !description || !imageUrl || !birthdate || !price || !petCode) {
        alert('Please fill in all fields!');
        return; 
    }

    const urlRegex = /\.(jpeg|jpg|gif|png)$/i; 
    if (!urlRegex.test(imageUrl)) {
        alert('Please enter a valid image URL (must end in .jpg, .png, or .gif)');
        return;
    }

    const today = new Date();
    const birthDateObj = new Date(birthdate);
    if (birthDateObj > today) {
        alert('Birthdate cannot be in the future!');
        return;
    }

    const priceNum = parseFloat(price); 
    if (priceNum <= 0) {
        alert('Price must be a positive number!');
        return;
    }

    const codeRegex = /^[A-Z]{3}[0-9]{3}$/i; 
    if (!codeRegex.test(petCode)) {
        alert('Pet Code must be 3 letters followed by 3 numbers (e.g., CAT123)');
        return;
    }

// This function runs when the form is submitted

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

    //  ADD NEW PET
    // Create a new pet object
    const newPet = {
        // Use timestamp for a simple unique ID
        id: Date.now(), 
        name: name,
        description: description,
        imageUrl: imageUrl,
        birthdate: birthdate,
        price: parseFloat(price), // convert to number
        petCode: petCode,
        isSold: isSold
    };

    // Add the new pet to our global array
    pets.push(newPet);
    
    // Log to console to check
    console.log(pets);

    // Clear the form fields
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

function renderPets() {
    // Clear the entire list container
    petListContainer.innerHTML = '';

    // Loop through every pet in our 'pets' array
    for (const pet of pets) {
        
        // Create the HTML string for the pet card 
        const petCardHtml = `
            <div class="pet-card" data-id="${pet.id}">
                <img src="${pet.imageUrl}" alt="${pet.name}">
                <h4>${pet.name}</h4>
                <p><strong>Code:</strong> ${pet.petCode}</p>
                <p><strong>Born:</strong> ${pet.birthdate}</p>
                <p><strong>Price:</strong> $${pet.price.toFixed(2)}</p>
                <p>${pet.description}</p>
                
                <div class="buttons">
                    </div>
            </div>
        `;

        // Add the new HTML string to the container
        petListContainer.innerHTML += petCardHtml;
    }
}


// Deletes a pet when the 'Delete' button is clicked
function deletePet(id) {
    // Ask for confirmation
    if (confirm('Are you sure you want to delete this pet?')) {
        // Re-create the 'pets' array, filtering out the one with the matching ID
        pets = pets.filter(pet => pet.id !== id);

        // Re-draw the list
        renderPets();
    }
}

// Initial render
renderPets();