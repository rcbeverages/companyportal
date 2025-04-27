// Set the logged-in BDM name (should be dynamically retrieved from login)
const username = 'rhincksman';  // Replace with dynamic value if needed
const remindersApiUrl = 'https://sheetdb.io/api/v1/lkhkbez8p8el9';  // Reminders API
const customersApiUrl = 'https://sheetdb.io/api/v1/8ba1eug88u4y1';  // Master Store List API

// Fetch user data from the username API (filtering based on username)
async function fetchUserData() {
  try {
    // Fetch user data based on username from the API
    const response = await fetch(`https://sheetdb.io/api/v1/abgzvmn3160g0/search?Username=${username}`);
    const data = await response.json();

    if (data.length > 0) {
      // If user exists, extract BDM name
      const bdmName = data[0].Username;  // Username is used as BDM name

      // Store BDM name in sessionStorage
      sessionStorage.setItem('bdmName', bdmName);
      console.log(`Logged in as: ${bdmName}`);
    } else {
      console.log('User not found.');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

// Fetch and display reminders specific to the logged-in BDM
async function loadReminders() {
  try {
    const bdmName = sessionStorage.getItem('bdmName');  // Get the logged-in BDM name
    console.log('Logged-in BDM:', bdmName);  // Log BDM name to check if it's correct

    const response = await fetch(remindersApiUrl);
    const data = await response.json();

    console.log('API Response:', data);  // Log the response to see the full data

    const reminderList = document.getElementById('reminderList');
    reminderList.innerHTML = '';  // Clear current list

    // Filter reminders for the logged-in BDM
    const filteredReminders = data.filter(reminder => {
      console.log('Reminder BDM_Name:', reminder.BDM_Name);  // Log BDM_Name field from each reminder
      return reminder.BDM_Name === bdmName;
    });

    console.log('Filtered Reminders:', filteredReminders);  // Check if filtering works

    // Sort reminders by Date to Email (ascending)
    filteredReminders.sort((a, b) => new Date(a.Date_to_Email) - new Date(b.Date_to_Email));

    // Display filtered and sorted reminders in the table
    filteredReminders.forEach(reminder => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${reminder.Date_to_Email}</td>
        <td>${reminder.Customer_Name}</td>
        <td>${reminder.Comments || '(No Comments)'}</td>  <!-- Display "(No Comments)" if comments are empty -->
      `;
      reminderList.appendChild(row);  // Append the row to the table
    });

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

// Load customers for the logged-in BDM
async function loadCustomersDropdown() {
  try {
    const bdmName = sessionStorage.getItem('bdmName');  // Get logged-in BDM name
    const response = await fetch(customersApiUrl);
    const data = await response.json();

    const filteredCustomers = data.filter(customer => customer.BDM_Name === bdmName);  // Filter by BDM

    const customerDropdown = document.getElementById('reminderCustomer');
    customerDropdown.innerHTML = '';  // Clear existing dropdown options

    // Add "Non Store Reminder" option
    const nonStoreOption = document.createElement('option');
    nonStoreOption.value = "Non Store Reminder";
    nonStoreOption.text = "Non Store Reminder";
    customerDropdown.appendChild(nonStoreOption);

    // Add filtered customers to the dropdown
    filteredCustomers.forEach(customer => {
      if (customer.Customer_Name) {
        const option = document.createElement('option');
        option.value = customer.Customer_Name;
        option.text = customer.Customer_Name;
        customerDropdown.appendChild(option);
      }
    });
  } catch (error) {
    console.error('Error loading customers:', error);
  }
}

// Handle the form submission to add a new reminder
document.getElementById('addReminderForm').addEventListener('submit', async function(event) {
  event.preventDefault();

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
    Date_to_Email: date,
    Customer_Name: customer,
    Comments: comments,
    BDM_Name: bdmName  // Attach the logged-in BDM's name to the reminder
  };

  try {
    await fetch(remindersApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: [reminderData] }),
    });

    closeAddReminder();
    loadReminders();  // Refresh the reminders list after adding a new one
  } catch (error) {
    console.error('Error saving reminder:', error);
  }
});

// Open the modal when the "Add New Reminder" button is clicked
document.getElementById('addReminderBtn').addEventListener('click', openAddReminder);

// Load reminders when the page loads
window.onload = function() {
  fetchUserData();  // Fetch user data (set BDM name and role in sessionStorage)
  loadReminders();  // Load reminders for the logged-in BDM
};
