const slotsContainer = document.getElementById("slots");
const tagInput = document.getElementById("tag-input");
const addTagButton = document.getElementById("add-tag");
const submitButton = document.getElementById("submit-button");

const startTime = 6; // Start time (6:00 AM)
const endTime = 30; // End time (6:00 AM of the next day)
const timeSlots = [];
const selectedTimeSlots = [];
const selectedTags = [];

// Generate time slots with 1-hour intervals
for (let i = startTime; i < endTime; i++) {
    const slotStartTime = i % 24;
    const slotEndTime = (i + 1) % 24;
    const slotLabel = `${slotStartTime.toString().padStart(2, '0')}:00 - ${slotEndTime.toString().padStart(2, '0')}:00`;
    timeSlots.push(slotLabel);
}

timeSlots.forEach((slot) => {
    const slotElement = document.createElement("div");
    slotElement.classList.add("slot");
    slotElement.textContent = slot;

    slotElement.addEventListener("click", () => {
        slotElement.classList.toggle("selected");

        if (slotElement.classList.contains("selected")) {
            selectedTimeSlots.push(slot);
        } else {
            selectedTimeSlots = selectedTimeSlots.filter((time) => time !== slot);
        }
    });

    slotsContainer.appendChild(slotElement);
});

// Predefined tags
const predefinedTags = ["RPH", "SOMU SONNET", "PFR", "AS"];

function displayTags() {
    const searchTagsContainer = document.querySelector(".search-tags");
    searchTagsContainer.innerHTML = "";
    selectedTags.forEach((tag) => {
        const tagSpan = document.createElement("span");
        tagSpan.textContent = tag;
        tagSpan.addEventListener("click", () => {
            // Remove the tag when clicked
            selectedTags.splice(selectedTags.indexOf(tag), 1);
            displayTags();
        });
        searchTagsContainer.appendChild(tagSpan);
    });
}

// Function to populate the datalist with predefined tags
function populateDatalist() {
    const datalist = document.getElementById("tags-list");
    datalist.innerHTML = "";
    predefinedTags.forEach((tag) => {
        const option = document.createElement("option");
        option.value = tag;
        datalist.appendChild(option);
    });
}

// Display predefined tags in the datalist
populateDatalist();

addTagButton.addEventListener("click", () => {
    const tag = tagInput.value.trim();
    if (tag !== "" && !selectedTags.includes(tag)) {
        selectedTags.push(tag);
        tagInput.value = "";
        displayTags();
    }
});

submitButton.addEventListener("click", () => {
    // Prepare the data to send
    const name = document.getElementById("name").value;
    const aadhar = document.getElementById("aadhar").value;
    const mobile = document.getElementById("mobile").value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const services = [...document.querySelectorAll('input[name="services"]:checked')].map((checkbox) => checkbox.value);

    const data = {
        aadhar_number: aadhar,
        name: name,
        phone_number: mobile,
        gender: gender,
        services: services.join(', '),
        locations: selectedTags.join(', '),
        timings: selectedTimeSlots.join(', '),
    };

    // Send the data to the specified form URL
    sendDataToFormester(data);
});

function sendDataToFormester(data) {
    const formesterFormUrl = 'https://app.formester.com/forms/ff4c730e-ebd4-41b3-86bd-17f0802f36ac/submissions';

    fetch(formesterFormUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Charset': 'UTF-8',
        },
        body: new URLSearchParams(data).toString(),
    })
        .then((response) => {
            if (response.ok) {
                alert('Data submitted successfully to YellowSense.');
            } else {
                alert('Failed to submit data to YellowSense.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while submitting data.');
        });
}
