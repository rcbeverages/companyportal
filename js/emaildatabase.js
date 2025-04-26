document.addEventListener("DOMContentLoaded", function() {
  const storeListContainer = document.getElementById("storeList");
  const selectAllButton = document.getElementById("selectAllButton");
  const searchInput = document.getElementById("searchInputEmail");
  const sendEmailButton = document.getElementById("sendEmailButton");

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
            const storeRow = document.createElement("tr");
            storeRow.innerHTML = `
              <td><input type="checkbox" class="selectStoreCheckbox" data-email="${store["Email"]}"></td>
              <td>${store["Customer Name"]}</td>
              <td>${store["Sub Owner Group"]}</td>
              <td>${store["Key Account Group"]}</td>
              <td>${store["Grade"]}</td>
              <td>${store["Store Type"]}</td>
              <td><a href="mailto:${store["Email"]}">${store["Email"]}</a></td>
            `;
            storeListContainer.appendChild(storeRow);
          });
        }
      }

      // Display all stores initially for the BDM
      displayStores(storesForBDM);

      // Search functionality (applies on input event of the search field)
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

        // Enable/Disable Send Email button based on search results
        sendEmailButton.disabled = filteredStores.length === 0 || !Array.from(document.querySelectorAll(".selectStoreCheckbox:checked")).length;
      });

      // Select All Button functionality
      selectAllButton.addEventListener("click", function() {
        const checkboxes = document.querySelectorAll(".selectStoreCheckbox");
        const selectAllChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
        checkboxes.forEach(checkbox => checkbox.checked = !selectAllChecked);

        // Enable/Disable Send Email button based on selected checkboxes
        sendEmailButton.disabled = !Array.from(document.querySelectorAll(".selectStoreCheckbox:checked")).length;
      });

      // Send Email Button functionality
      sendEmailButton.addEventListener("click", function() {
        const selectedCheckboxes = document.querySelectorAll(".selectStoreCheckbox:checked");
        const selectedEmails = Array.from(selectedCheckboxes).map(checkbox => checkbox.getAttribute('data-email'));
        const bccEmails = selectedEmails.join(',');

        if (bccEmails) {
          // Open the default email client with the selected emails in BCC
          window.location.href = `mailto:?bcc=${bccEmails}`;
        }
      });
    })
    .catch(error => console.error("Error fetching store data:", error));
});
