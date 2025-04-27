// Define the API URL for reminders
const remindersApiUrl = 'https://sheetdb.io/api/v1/lkhkbez8p8el9';  // Reminders API endpoint

// Function to display reminders in the table
function displayReminders(reminders) {
  console.log("Fetched reminders:", reminders);  // Log fetched reminders for debugging

  const reminderList = document.getElementById('reminderList');
  reminderList.innerHTML = ''; // Clear previous results

  if (reminders.length === 0) {
    reminderList.innerHTML = "<p>No reminders found.</p>";
  } else {
    reminders.forEach(reminder => {
      const reminderRow = document.createElement("tr");
      reminderRow.innerHTML = `
       <td>${reminder["Date"]}</td>  <!-- Use 'Date' from the sheet -->
        <td>${reminder["Customer Name"]}</td>  <!-- Use 'Customer Name' from the sheet -->
        <td>${reminder["Comments"] || '(No Comments)'}</td>  <!-- Use 'Comments' from the sheet -->
      `;
      reminderList.appendChild(reminderRow);
    });
  }
}

// Fetch reminders from the API
function loadReminders() {
  fetch(remindersApiUrl)
    .then(response => response.json())  // Parse JSON data from API response
    .then(reminderData => {
      console.log("Fetched Reminders:", reminderData); // Log the data for debugging
      displayReminders(reminderData);  // Display reminders in the table
    })
    .catch(error => console.error("Error fetching reminder data:", error));
}

// Open the Add Reminder popup
function openAddReminder() {
  document.getElementById('addReminderPopup').style.display = 'block';
  loadCustomersDropdown();  // Load customers into the dropdown
}

// Close the Add Reminder popup
function closeAddReminder() {
  document.getElementById('addReminderPopup').style.display = 'none';
  document.getElementById('addReminderForm').reset();  // Reset the form
}

// Handle the form submission to add a new reminder
document.getElementById('addReminderForm').addEventListener('submit', function(event) {
  event.preventDefault();  // Prevent form from reloading the page

  const date = document.getElementById('reminderDate').value;
  const customer = document.getElementById('reminderCustomer').value;
  const comments = document.getElementById('reminderComments').value;
  const bdmName = sessionStorage.getItem('bdmName');  // Get BDM name from sessionStorage

  // Ensure bdmName is available before proceeding
  if (!bdmName) {
    console.error("BDM name is not set. Cannot add reminder.");
    return;
  }

  const reminderData = {
    Email: date,
    Customer Name: customerName,
    Comments: comments,
    "BDM Name": bdmName  // Attach the logged-in BDM's name to the reminder
  };

  // POST request to add the new reminder
  fetch(remindersApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: [reminderData] })  // Add new reminder data
  })
  .then(response => response.json())
  .then(data => {
    console.log("Reminder added:", data);
    closeAddReminder();  // Close the modal after success
    loadReminders();  // Refresh the reminder list
  })
  .catch(error => console.error("Error adding reminder:", error));
});

// Event listener for Add Reminder button
document.getElementById('addReminderBtn').addEventListener('click', openAddReminder);

// Load reminders when the page loads
window.onload = function() {
  loadReminders();  // Load reminders for the logged-in BDM
  }
});
