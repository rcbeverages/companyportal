// Define the API URL for reminders
const remindersApiUrl = 'https://sheetdb.io/api/v1/lkhkbez8p8el9';  // Reminders API endpoint
const customersApiUrl = 'https://sheetdb.io/api/v1/8ba1eug88u4y1';  // Master Store List API endpoint

// Fetch and display reminders specific to the logged-in BDM
async function loadReminders() {
  try {
    const username = localStorage.getItem('username');  // Get username from localStorage
    console.log('Logged-in BDM (username):', username);  // Log username to check if it's correct

    const response = await fetch(remindersApiUrl);
    const data = await response.json();

    console.log('API Response:', data);  // Log the response to see the full data

    const reminderList = document.getElementById('reminderList');
    reminderList.innerHTML = ''; // Clear previous results

    // Filter reminders using "Username" instead of "BDM Name"
    const filteredReminders = data.filter(reminder => reminder["BDM Name"] === username);

    if (filteredReminders.length === 0) {
      reminderList.innerHTML = "<p>No reminders found for this BDM.</p>";
    } else {
      // Display reminders for the logged-in BDM
      filteredReminders.forEach(reminder => {
        const reminderRow = document.createElement("tr");
        reminderRow.innerHTML = `
          <td>${reminder["Date"]}</td>  <!-- Use 'Date' from the sheet -->
          <td>${reminder["Customer Name"]}</td>  <!-- Use 'Customer Name' from the sheet -->
          <td>${reminder["Comments"] || '(No Comments)'}</td>  <!-- Use 'Comments' from the sheet -->
        `;
        reminderList.appendChild(reminderRow);
      });
    }
  } catch (error) {
    console.error('Error loading reminders:', error);
    const reminderList = document.getElementById('reminderList');
    reminderList.innerHTML = '<p style="color:red;">Error loading reminders. Please try again later.</p>';
  }
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
    "Date": date,  // Use 'Date' from the sheet
    "Customer Name": customer,  // Correct key with space
    "Comments": comments,  // Correct key with space
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
    loadReminders();  // Refresh the reminder list after adding a new one
  })
  .catch(error => console.error("Error adding reminder:", error));
});

// Event listener for Add Reminder button
document.getElementById('addReminderBtn').addEventListener('click', openAddReminder);

// Load customers for the logged-in BDM
async function loadCustomersDropdown() {
  try {
    const bdmName = sessionStorage.getItem('bdmName');  // Get logged-in BDM name
    const response = await fetch(customersApiUrl);
    const data = await response.json();

    // Filter customers by the logged-in BDM
    const filteredCustomers = data.filter(customer => customer["BDM Name"] === bdmName);  // Filter by "BDM Name"

    const customerDropdown = document.getElementById('reminderCustomer');
    customerDropdown.innerHTML = '';  // Clear existing dropdown options

    // Add "Non Store Reminder" option
    const nonStoreOption = document.createElement('option');
    nonStoreOption.value = "Non Store Reminder";
    nonStoreOption.text = "Non Store Reminder";
    customerDropdown.appendChild(nonStoreOption);

    // Add filtered customers to the dropdown
    filteredCustomers.forEach(customer => {
      if (customer["Customer Name"]) {  // Use "Customer Name" from the sheet
        const option = document.createElement('option');
        option.value = customer["Customer Name"];
        option.text = customer["Customer Name"];
        customerDropdown.appendChild(option);
      }
    });
  } catch (error) {
    console.error('Error loading customers:', error);
  }
}

// Load reminders when the page loads
window.onload = function() {
  loadReminders();  // Load reminders for the logged-in BDM
};
