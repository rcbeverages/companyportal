document.addEventListener("DOMContentLoaded", function() {
  const storeListContainer = document.getElementById("storeList");
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
  const searchInput = document.getElementById("searchInput");
  const sendEmailButton = document.getElementById("sendEmailButton");

  const apiEndpoint = "https://sheetdb.io/api/v1/8ba1eug88u4y1"; // Replace this with the correct API endpoint for your Master Store List

  // Fetch data from the Master Store List API
  fetch(apiEndpoint)
    .then(response => response.json())
    .then(data => {
      const customersWithEmails = data.filter(store => store.Email);  // Filter to include only customers with emails

      function displayStores(stores) {
        storeListContainer.innerHTML = ""; // Clear previous results

        stores.forEach(store => {
          const storeDiv = document.createElement("div");
          storeDiv.className = "store-item";
          storeDiv.innerHTML = `
            <label>
              <input type="checkbox" class="selectStoreCheckbox">
              ${store.Customer_Name} | ${store.Sub_Owner_Group} | ${store.Key_Account_Group} | ${store.Grade} | ${store.Store_Type} | <a href="mailto:${store.Email}">${store.Email}</a>
            </label>
          `;
          storeListContainer.appendChild(storeDiv);
        });
      }

      // Display all stores initially
      displayStores(customersWithEmails);

      // Search functionality
      searchInput.addEventListener("input", function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredStores = customersWithEmails.filter(store => {
          return (
            store.Customer_Name.toLowerCase().includes(searchTerm) ||
            store.Sub_Owner_Group.toLowerCase().includes(searchTerm) ||
            store.Key_Account_Group.toLowerCase().includes(searchTerm) ||
            store.Grade.toLowerCase().includes(searchTerm) ||
            store.Store_Type.toLowerCase().includes(searchTerm)
          );
        });
        displayStores(filteredStores);

        // Enable/Disable Send Email button
        sendEmailButton.disabled = searchTerm.length === 0;
      });

      // Select All Checkbox
      selectAllCheckbox.addEventListener("change", function() {
        const checkboxes = document.querySelectorAll(".selectStoreCheckbox");
        checkboxes.forEach(checkbox => checkbox.checked = selectAllCheckbox.checked);
      });
    })
    .catch(error => console.error("Error fetching store data:", error));
});
