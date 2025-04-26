document.addEventListener("DOMContentLoaded", function() {
  const storeListContainer = document.getElementById("storeList");
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
  const searchInput = document.getElementById("searchInput");
  const sendEmailButton = document.getElementById("sendEmailButton");
  const searchButton = document.getElementById("searchButton");
  const selectAllButton = document.getElementById("selectAllButton");

  const apiEndpoint = "https://sheetdb.io/api/v1/8ba1eug88u4y1"; // Replace with your actual API endpoint for Master Store List
  const bdmUsername = localStorage.getItem("username"); // Get logged-in BDM's username

  // Fetch data from the Master Store List API
  fetch(apiEndpoint)
    .then(response => response.json())
    .then(data => {
      // Filter stores that belong to the logged-in BDM
      const storesForBDM = data.filter(store => store["BDM"] === bdmUsername && store["Email"]);

      function displayStores(stores) {
        storeListContainer.innerHTML = ""; // Clear previous results

        if (stores.length === 0) {
          storeListContainer.innerHTML = "<p>No stores found for this BDM.</p>";
        } else {
          stores.forEach(store => {
            const storeDiv = document.createElement("div");
            storeDiv.className = "store-item";
            storeDiv.innerHTML = `
              <label>
                <input type="checkbox" class="selectStoreCheckbox">
                <span>${store["Customer Name"]}</span> |
                <span>${store["Sub Owner Group"]}</span> |
                <span>${store["Key Account Group"]}</span> |
                <span>${store["Grade"]}</span> |
                <span>${store["Store Type"]}</span> |
                <a href="mailto:${store["Email"]}">${store["Email"]}</a>
              </label>
            `;
            storeListContainer.appendChild(storeDiv);
          });
        }
      }

      // Display all stores initially for the BDM
      displayStores(storesForBDM);

      // Search functionality
      searchInput.addEventListener("input", function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredStores = storesForBDM.filter(store => {
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

      // Manually trigger search when the "Search" button is clicked
      searchButton.addEventListener("click", function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredStores = storesForBDM.filter(store => {
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

      // Select All Button functionality
      selectAllButton.addEventListener("click", function() {
        const checkboxes = document.querySelectorAll(".selectStoreCheckbox");
        const selectAllChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
        checkboxes.forEach(checkbox => checkbox.checked = !selectAllChecked);
      });
    })
    .catch(error => console.error("Error fetching store data:", error));
});
