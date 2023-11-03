// Define emission factors for each mode of transportation
const emissionFactors = {
    "Marche": 0,
    "Vélo": 6,
    "Bus/Tram": 6.8,
    "Train": 8,
    "Vélo électrique": 22,
    "Scooter électrique": 30,
    "Citroën Ami": 45,
    "Renault Zoe": 95,
    "Scooter thermique": 105,
    "Tesla": 137,
    "Citadine thermique": 240,
    "SUV": 360
};


// Function to calculate the total emission for a day
function calculateEmissionForDay(day) {
    const values = dayValues[day];
    if (!values) {
        return 0; // No values for this day
    }

    // Calculate the total emission for the day
    const totalEmission = values.reduce((total, value, index) => {
        const transport = Object.keys(emissionFactors)[index];
        const emissionFactor = emissionFactors[transport];
        return total + (value * emissionFactor);
    }, 0);

    return totalEmission;
}

// Function to update the displayed total emission for the selected day
function updateTotalEmission(day) {
    const totalEmission = calculateEmissionForDay(day);
    const dayDiv = document.querySelector(`[data-day="${day}"]`);
    const totalEmissionDisplay = dayDiv.querySelector(".total-emission");
    totalEmissionDisplay.textContent = `Total Emission: ${totalEmission.toFixed(2)} gCO2`;
}

document.getElementById("calcul_semaine").addEventListener("click", function() {
    // Show the entire container when the button is clicked
    const totalEmissionContainer = document.getElementById("totalEmissionContainer");
    totalEmissionContainer.style.display = "inline";

    // Call the function to update the total emission
    updateTotalWeekEmission();
});

// Object to store values for each day
const dayValues = {};

// Function to initialize the value boxes with default value "0"
function initializeValueBoxes() {
    for (let i = 1; i <= 12; i++) {
        dayValues[`Day ${i}`] = 0; // Initialize dayValues with "0" for each day
        const valueBox = document.getElementById(`valueBox${i}`);
        if (valueBox) {
            valueBox.value = "0"; // Set the input value to "0"
        }
    }
}

// Initialize the value boxes when the page loads
initializeValueBoxes();

// Function to initialize day buttons and values
function initializeDays() {
    const dayButtons = document.querySelectorAll(".days");

    dayButtons.forEach((dayButton, index) => {
        dayButton.addEventListener("click", function () {
            // Update the selected day button
            setSelectedDay(dayButton);

            // Display the values for the selected day
            displayValuesForDay(dayButton);
        });
    });
}

// Function to set the selected day
function setSelectedDay(selectedDayButton) {
    const dayButtons = document.querySelectorAll(".days");
    dayButtons.forEach((dayButton) => {
        dayButton.classList.remove("selected");
    });
    selectedDayButton.classList.add("selected");
}

// Function to display the values for the selected day
function displayValuesForDay(selectedDayButton) {
    const day = selectedDayButton.textContent;
    const valueBoxes = document.querySelectorAll(".value-input");

    valueBoxes.forEach((valueBox, index) => {
        const value = dayValues[day] ? dayValues[day][index] : "";
        valueBox.value = value;
    });
}

// Function to save the values for the selected day
document.getElementById("saveValue").addEventListener("click", function () {
    const selectedDayButton = document.querySelector(".days.selected");

    if (selectedDayButton) {
        const day = selectedDayButton.textContent;
        const valueBoxes = document.querySelectorAll(".value-input");
        const values = Array.from(valueBoxes).map((valueBox) =>
            parseFloat(valueBox.value) || 0
        );

        dayValues[day] = values;

        // Display a message indicating that the values have been saved
        //alert(`Values saved for ${day}: ${values}`);

        // Update the saved values and total emission on the page
        updateSavedValues(day);
        updateTotalEmission(day);
    }
});

// Call the initializeDays function to set up the button behaviors
initializeDays();


document.getElementById("mybutton").addEventListener("click", function() {
    var container = document.getElementById("container");

    if (container.style.display === "none") {
        container.style.display = "block";
    } else {
        container.style.display = "none";
    }
});

let containerVisible = false;

// Modify the code for "jours" button
document.getElementById("jours").addEventListener("click", function(event) {
    var container = document.getElementById("container");

    if (!containerVisible) {
        container.style.display = "block";
        containerVisible = true;
    }

    // Remove the "selected" class from all day buttons
    var dayButtons = document.querySelectorAll(".days");
    dayButtons.forEach(function(dayButton) {
        dayButton.classList.remove("selected");
    });

    // Add the "selected" class to the clicked day button
    event.target.classList.add("selected");

    // Récupérez le jour cliqué
    var selectedDay = event.target.textContent;
    // Mettez à jour le titre du jour dans le conteneur
    //document.getElementById("dayTitle").textContent = "Trajet pour le " + selectedDay;

    // Display the value for the selected day
    const value = dayValues[selectedDay] || '';
    document.getElementById("valueBox").value = value;
});

// Add an event listener for the "Save Value" button
document.getElementById("saveValue").addEventListener("click", function() {
    // Find the selected day button
    const selectedDayButton = document.querySelector(".days.selected");
    
    if (selectedDayButton) {
        // Get the selected day
        const selectedDay = selectedDayButton.textContent;

        // Find the input box associated with the selected day
        const inputId = "valueBox" + selectedDayButton.dataset.dayIndex; // Assumes you have a "data-day-index" attribute on your day buttons

        // Get the value entered by the user for the selected day
        const value = parseFloat(document.getElementById(inputId).value) || 0;

        // Store the value for the selected day in your dayValues object
        dayValues[selectedDay] = value;

        // Display a message indicating that the value has been saved
        //alert("Value saved for " + selectedDay + ": " + value);
    } else {
        // If no day is selected, display the warning message
        const existingWarning = document.querySelector(".wrapper-warning");

        if (existingWarning) {
            // Show the warning message
            existingWarning.style.display = "block";
        } else {
            // If the warning doesn't exist, create and append it to the body
            const warningHTML = `
                <div class="wrapper-warning">
                    <div class="modal">
                        <div class="card">
                            <div class="icon"><i class="fas fa-exclamation-circle"></i></div>
                            <div class="subject">
                                <hw>   Attention</hw>
                                <br>
                                <pw>   Sélectionner un jour avant de sauver vos trajets !</pw>
                            </div>
                            <div class="icon-times"><i class="fas fa-times"></i></div>
                        </div>
                    </div>
                </div>`;

            document.body.insertAdjacentHTML("beforeend", warningHTML);

            // Get the created warning element
            const newWrapperWarning = document.querySelector(".wrapper-warning");
            newWrapperWarning.style.display = "block";

            // Close the warning when the 'close' icon is clicked
            const iconTimes = newWrapperWarning.querySelector(".icon-times");
            iconTimes.addEventListener("click", function () {
                newWrapperWarning.style.display = "none";

                // Enable interaction after the warning is closed
                const elementsToEnable = document.querySelectorAll("button, input");
                elementsToEnable.forEach((element) => {
                    element.disabled = false;
                });
            });

            // Disable interaction until the warning is acknowledged
            const elementsToDisable = document.querySelectorAll("button, input");
            elementsToDisable.forEach((element) => {
                element.disabled = true;
            });
        }
    }
});

//calcul sum
let values = [];

function getValues() {
	values = []; // Clear the previous values

	for (let i = 1; i <= 12; i++) {
		const value = parseFloat(document.getElementById("valueBox" + i).value) || 0;
		values.push(value);
	}

	alert("Values: " + values.join("\n"));
}

let sum = 0;

function calculateSum() {
	sum = values.reduce((total, value) => total + value, 0);
	alert("Sum of Values: " + sum);
}


// Function to update the total emission for the week
function updateTotalWeekEmission() {
    const days = Object.keys(dayValues);
    let totalWeekEmission = 0;

    days.forEach((day) => {
        totalWeekEmission += calculateEmissionForDay(day);
    });

    const totalEmissionDisplay = document.getElementById("totalWeeklyEmission");
    const emissionLogo = document.getElementById("emissionLogo"); // Get the image element

    let totalEmissionText = `Total Emission Hebdomadaire: ${totalWeekEmission.toFixed(2)} gCO2`;

    if (totalWeekEmission > 1000) {
        // Convert to kilograms (1 kg = 1000 g)
        const totalEmissionInKg = (totalWeekEmission / 1000).toFixed(2);
        totalEmissionText = `Total Emission Hebdomadaire: ${totalEmissionInKg} kgCO2`;
    }

    totalEmissionDisplay.textContent = totalEmissionText;
}


    const transportEmissions = {};    
    const transportTypes = ["Marche","Vélo","Bus/Tram","Train","Vélo électrique","Scooter électrique","Citroën Ami","Renault Zoe","Scooter thermique","Tesla","Citadine thermique","SUV"];
    const transportFactors = [0,6,6.8,8,22,30,45,95,105,137,240,360];
let calculationsPerformed = false;

document.getElementById("calcul_semaine").addEventListener("click", function() {
    
    const transportEmissionsElement = document.getElementById("transportEmissions");
    transportEmissionsElement.innerHTML = ""; // Clear previous transport emissions

    for (let i = 1; i <= 12; i++) {
        const inputId = "valueBox" + i; // Assuming this is the ID for the input box
        const emissionValue = parseFloat(document.getElementById(inputId).value) || 0;

        if (emissionValue > 0) {
            const totalEmissionForDay = emissionValue * transportFactors[i - 1];
            const transportType = transportTypes[i - 1];

            if (!transportEmissions[transportType]) {
                transportEmissions[transportType] = 0;
            }
            transportEmissions[transportType] += totalEmissionForDay;
        }
    }

    // Display the accumulated emissions for each transport type
    for (const transportType in transportEmissions) {
        const p = document.createElement("p");
        p.textContent = `${transportType}: ${transportEmissions[transportType]}g`;
        transportEmissionsElement.appendChild(p);
    }
});

// Function to toggle the "Number of people in the car" text box
function togglePeopleCount(vehicleId) {
    var peopleCount = document.getElementById("peopleCount_" + vehicleId);

    if (peopleCount.style.display === "block") {
        peopleCount.style.display = "none";
        document.getElementById("radioYes_" + vehicleId).checked = false; // Deselect the radio button
    } else {
        peopleCount.style.display = "block";
    }
}

// Add event listeners to all "Yes" radio buttons
document.getElementById("radioYes_ami").addEventListener("click", function () {
    togglePeopleCount("ami");
});

document.getElementById("radioYes_zoe").addEventListener("click", function () {
    togglePeopleCount("zoe");
});

document.getElementById("radioYes_tesla").addEventListener("click", function () {
    togglePeopleCount("tesla");
});

document.getElementById("radioYes_citadine").addEventListener("click", function () {
    togglePeopleCount("citadine");
});

document.getElementById("radioYes_SUV").addEventListener("click", function () {
    togglePeopleCount("SUV");
});