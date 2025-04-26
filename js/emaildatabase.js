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
              <td><button class="visit-btn" data-store="${store["Customer Name"]}" data-store-id="${store["Store ID"]}" data-store-email="${store["Email"]}">Visit</button></td>
              <td>${store["Customer Name"]}</td>
              <td>${store["Sub Owner Group"]}</td>
              <td>${store["Key Account Group"]}</td>
              <td>${store["Grade"]}</td>
              <td>${store["Store Type"]}</td>
            `;
            storeListContainer.appendChild(storeRow);

            // Add event listener to the Visit button
            const visitButton = storeRow.querySelector(".visit-btn");
            visitButton.addEventListener("click", function() {
              const storeId = visitButton.getAttribute("data-store-id"); // Assuming you have Store ID to pass
              window.location.href = `visit.html?storeId=${storeId}`; // Redirect to visit.html with the store's ID
            });
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
        const visitButtons = document.querySelectorAll(".visit-btn");
        const allVisited = Array.from(visitButtons).every(button => button.disabled);
        visitButtons.forEach(button => button.disabled = !allVisited);
      });

      // Send Email Button functionality
      sendEmailButton.addEventListener("click", function() {
        // Get all selected stores (those with disabled visit buttons)
        const selectedStores = document.querySelectorAll(".visit-btn:disabled");
        
        // Collect the emails of the selected stores
        const storeEmails = Array.from(selectedStores).map(button => button.getAttribute('data-store-email'));

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
