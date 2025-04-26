document.addEventListener("DOMContentLoaded", function() {
  const storeListContainer = document.getElementById("storeList");
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
  const searchInput = document.getElementById("searchInput");
  const sendEmailButton = document.getElementById("sendEmailButton");

  const apiEndpoint = "https://sheetdb.io/api/v1/8ba1eug88u4y1"; // Replace with your actual API endpoint for Master Store List

  // Fetch data from the Master Store List API
  fetch(apiEndpoint)
    .then(response => response.json())
    .then(data => {
      // Filter out stores that do not have an email
      const customersWithEmails = data.filter(store => store["Email"]);

      function displayStores(stores) {
        storeListContainer.innerHTML = ""; // Clear previous results

        if (stores.length === 0) {
          storeListContainer.innerHTML = "<p>No stores found.</p>";
        } else {
          stores.forEach(store => {
            const storeDiv = document.createElement("div");
            storeDiv.className = "store-item";
            storeDiv.innerHTML = `
              <label>
                <input type="checkbox" class="selectStoreCheckbox">
                ${store["Customer Name"]} | ${store["Sub Owner Group"]} | ${store["Key Account Group"]} | ${store["Grade"]} | ${store["Store Type"]} | <a href="mailto:${store["Email"]}">${store["Email"]}</a>
              </label>
            `;
            storeListContainer.appendChild(storeDiv);
          });
        }
      }

      // Display all stores initially
      displayStores(customersWithEmails);

      // Search functionality
      searchInput.addEventListener("input", function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredStores = customersWithEmails.filter(store => {
          return (
            store["Customer Name"].toLowerCase().includes(searchTerm) ||
            store["Sub Owner Group"].toLowerCase().includes(searchTerm) ||
            store["Key Account Group"].toLowerCase().includes(searchTerm) ||
            store["Grade"].toLowerCase().includes(searchTerm) ||
            store["Store Type"].toLowerCase().includes(searchTerm)
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
