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
              <td><input type="checkbox" class="select-store" data-store-email="${store["Email"]}" /></td>
              <td>${store["Customer Name"]}</td>
              <td>${store["Sub Owner Group"]}</td>
              <td>${store["Key Account Group"]}</td>
              <td>${store["Grade"]}</td>
              <td>${store["Store Type"]}</td>
              <td>${store["Email"]}</td>
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
      });

      // Select All Button functionality
      selectAllButton.addEventListener("click", function() {
        const checkboxes = document.querySelectorAll(".select-store");
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
        checkboxes.forEach(checkbox => checkbox.checked = !allChecked);
      });

      // Send Email Button functionality
      sendEmailButton.addEventListener("click", function() {
        // Get all selected stores (those with checked checkboxes)
        const selectedStores = document.querySelectorAll(".select-store:checked");

        // Collect the emails of the selected stores
        const storeEmails = Array.from(selectedStores).map(checkbox => checkbox.getAttribute('data-store-email'));

        // Join emails to create the BCC string
        const bccEmails = storeEmails.join(',');

        // Check if there are any emails to send
        if (bccEmails) {
          // Create the mailto link with BCC field
          const mailtoLink = `mailto:?bcc=${bccEmails}&subject=Store Visits&body=Please%20find%20the%20list%20of%20stores%20below:%0A%0A${encodeURIComponent(storeEmails.join('\n'))}`;

          // Open the default email client (Outlook or others)
          window.location.href = mailtoLink;
        } else {
          // Show a message or do nothing if no stores are selected
          alert("Please select at least one store to send an email.");
        }
      });
    })
    .catch(error => console.error("Error fetching store data:", error));
});
