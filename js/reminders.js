const username = 'rhincksman';  // This should be dynamically set based on login form
const remindersApiUrl = 'https://sheetdb.io/api/v1/lkhkbez8p8el9';  // Reminders API
const customersApiUrl = 'https://sheetdb.io/api/v1/8ba1eug88u4y1';  // Master Store List API

// Fetch user data from the username API (filtering based on username)
async function fetchUserData() {
  try {
    const response = await fetch(`https://sheetdb.io/api/v1/abgzvmn3160g0/search?Username=${username}`);
    const data = await response.json();

    console.log("API Data:", data);  // Log the full API data to check the structure

    if (data.length > 0) {
      const bdmName = data[0].Username;  // Username is used as BDM name

      // Store the BDM name and role in sessionStorage
      sessionStorage.setItem('bdmName', bdmName);

      console.log(`Logged in as: ${bdmName}`);
    } else {
      console.log('User not found.');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }

// Fetch and display reminders specific to the logged-in BDM
async function loadReminders() {
  try {
    const bdmName = sessionStorage.getItem('bdmName').toLowerCase().trim();  // Get the logged-in BDM name, make it lowercase and trim spaces
    const response = await fetch(remindersApiUrl);
    const data = await response.json();

    const reminderList = document.getElementById('reminderList');
    reminderList.innerHTML = '';  // Clear current list

    // Filter reminders for the logged-in BDM (case-insensitive and trimmed)
    const filteredReminders = data.filter(reminder => reminder['BDM Name'].toLowerCase().trim() === bdmName);

    if (filteredReminders.length === 0) {
      reminderList.innerHTML = '<tr><td colspan="4" style="color:red;">No reminders found for the logged-in BDM.</td></tr>';
    }

    // Sort reminders by Date to Email (ascending)
    filteredReminders.sort((a, b) => new Date(a['Date']) - new Date(b['Date']));

    // Display filtered and sorted reminders
    filteredReminders.forEach(reminder => {
      const reminderItem = document.createElement('tr');
      reminderItem.className = 'reminder-item';
      reminderItem.innerHTML = `
        <td>${reminder['Date']}</td>
        <td>${reminder['Customer Name']}</td>
        <td>${reminder.Comments ? reminder.Comments : '(No Comments)'}</td>
        <td>${reminder['BDM Name']}</td> <!-- Display the BDM Name here -->
      `;
      reminderList.appendChild(reminderItem);
    });

  } catch (error) {
    console.error('Error loading reminders:', error);
    const reminderList = document.getElementById('reminderList');
    reminderList.innerHTML = '<tr><td colspan="4" style="color:red;">Error loading reminders. Please try again later.</td></tr>';
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

    const filteredCustomers = data.filter(customer => customer['BDM Name'] === bdmName);  // Filter by BDM

    const customerDropdown = document.getElementById('reminderCustomer');
    customerDropdown.innerHTML = '';  // Clear existing dropdown options

    // Add "Non Store Reminder" option
    const nonStoreOption = document.createElement('option');
    nonStoreOption.value = "Non Store Reminder";
    nonStoreOption.text = "Non Store Reminder";
    customerDropdown.appendChild(nonStoreOption);

    // Add filtered customers to the dropdown
    filteredCustomers.forEach(customer => {
      if (customer['Customer Name']) {
        const option = document.createElement('option');
        option.value = customer['Customer Name'];
        option.text = customer['Customer Name'];
        customerDropdown.appendChild(option);
      }
    });

    // Add search functionality (simple version)
    customerDropdown.addEventListener('input', function() {
      const filter = customerDropdown.value.toLowerCase();
      const options = customerDropdown.getElementsByTagName('option');
      Array.from(options).forEach(option => {
        if (option.text.toLowerCase().indexOf(filter) === -1) {
          option.style.display = 'none';
        } else {
          option.style.display = 'block';
        }
      });
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

  const reminderData = {
    Date: date,
    'Customer Name': customer,
    Comments: comments,
    'BDM Name': bdmName  // Attach the logged-in BDM's name to the reminder
  };

  try {
    await fetch(remindersApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: [reminderData] }),
    });

    closeAddReminder(); // Close the modal after adding the reminder
    loadReminders();    // Refresh the reminders list after adding a new one
  } catch (error) {
    console.error('Error saving reminder:', error);
  });

// Open the modal when the "Add New Reminder" button is clicked
document.getElementById('addReminderBtn').addEventListener('click', openAddReminder);

// Load reminders when the page loads
window.onload = function() {
  fetchUserData();  // Fetch user data (set BDM name and role in sessionStorage)
  loadReminders();  // Load reminders for the logged-in BDM
};
