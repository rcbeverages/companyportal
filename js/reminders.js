// Assuming BDM name is stored in sessionStorage or passed to the script
const bdmName = sessionStorage.getItem('bdmName'); // Replace with actual method to get logged-in BDM name

const remindersApiUrl = 'https://sheetdb.io/api/v1/lkhkbez8p8el9';
const customersApiUrl = 'https://sheetdb.io/api/v1/8ba1eug88u4y1'; // Master Store List

// Fetch and display reminders specific to the logged-in BDM
async function loadReminders() {
  try {
    const response = await fetch(remindersApiUrl);
    const data = await response.json();

    const reminderList = document.getElementById('reminderList');
    reminderList.innerHTML = '';

    // Filter reminders for the logged-in BDM
    const filteredReminders = data.filter(reminder => reminder.BDM_Name === bdmName);

    // Sort reminders by Date to Email (ascending)
    filteredReminders.sort((a, b) => new Date(a.Date_to_Email) - new Date(b.Date_to_Email));

    // Display filtered and sorted reminders
    filteredReminders.forEach(reminder => {
      const reminderItem = document.createElement('div');
      reminderItem.className = 'reminder-item';
      reminderItem.innerHTML = `
        <h3>${reminder.Customer_Name}</h3>
        <p><strong>Due:</strong> ${reminder.Date_to_Email}</p>
        <p><strong>Comments:</strong> ${reminder.Comments ? reminder.Comments : '(No Comments)'}</p>
      `;
      reminderList.appendChild(reminderItem);
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
  loadCustomersDropdown();
}

function closeAddReminder() {
  document.getElementById('addReminderPopup').style.display = 'none';
  document.getElementById('addReminderForm').reset();
}

// Load customers for the logged-in BDM
async function loadCustomersDropdown() {
  try {
    const response = await fetch(customersApiUrl);
    const data = await response.json();

    // Filter customers by the logged-in BDM
    const filteredCustomers = data.filter(customer => customer.BDM_Name === bdmName);

    const customerDropdown = document.getElementById('reminderCustomer');
    customerDropdown.innerHTML = '';

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
    loadReminders(); // Refresh the reminders list after adding a new one
  } catch (error) {
    console.error('Error saving reminder:', error);
  }
});

window.onload = function() {
  loadReminders(); // Load reminders for the logged-in BDM when the page loads
}
