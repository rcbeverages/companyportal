// emaildatabase.js

// Your API endpoint (Master Store List)
const apiUrl = "https://sheetdb.io/api/v1/8ba1eug88u4y1"; // <-- Confirm this is your latest Master Store List

// Store the fetched store data
let stores = [];

// Fetch data on load
window.onload = function() {
  fetchStores();
};

function fetchStores() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Filter stores with an Email
      stores = data.filter(store => store.Email && store.Email.trim() !== "");
      renderStores(stores);
    })
    .catch(error => console.error('Error fetching store data:', error));
}

function renderStores(storeArray) {
  const storeList = document.getElementById('storeList');
  storeList.innerHTML = "";

  storeArray.forEach((store, index) => {
    const storeItem = document.createElement('div');
    storeItem.className = 'store-item';

    storeItem.innerHTML = `
      <input type="checkbox" class="store-checkbox" data-email="${store.Email}" id="store-${index}">
      <label for="store-${index}">
        <strong>${store['Store Name']}</strong> | 
        ${store['Sub Owner Group']} | 
        ${store['Key Account Group']} | 
        ${store['Grade']} | 
        ${store['Retail / On Premise']}
      </label>
    `;

    storeList.appendChild(storeItem);
  });

  setupCheckboxListener();
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredStores = stores.filter(store =>
    (store['Store Name'] && store['Store Name'].toLowerCase().includes(searchTerm)) ||
    (store['Sub Owner Group'] && store['Sub Owner Group'].toLowerCase().includes(searchTerm)) ||
    (store['Key Account Group'] && store['Key Account Group'].toLowerCase().includes(searchTerm)) ||
    (store['Grade'] && store['Grade'].toLowerCase().includes(searchTerm)) ||
    (store['Retail / On Premise'] && store['Retail / On Premise'].toLowerCase().includes(searchTerm))
  );
  renderStores(filteredStores);
});

// Enable/Disable Send Email button based on selection
function setupCheckboxListener() {
  const checkboxes = document.querySelectorAll('.store-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const anyChecked = Array.from(checkboxes).some(c => c.checked);
      document.getElementById('sendEmailButton').disabled = !anyChecked;
    });
  });
}

// Send email button logic
document.getElementById('sendEmailButton').addEventListener('click', function() {
  const selectedEmails = Array.from(document.querySelectorAll('.store-checkbox:checked'))
    .map(checkbox => checkbox.getAttribute('data-email'));

  if (selectedEmails.length > 0) {
    const mailtoLink = `mailto:?bcc=${encodeURIComponent(selectedEmails.join(','))}`;
    window.location.href = mailtoLink;
  }
});
