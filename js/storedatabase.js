document.addEventListener("DOMContentLoaded", function() {
  const storeListContainer = document.getElementById("storeList");
  const selectAllButton = document.getElementById("selectAllButton");
  const searchInput = document.getElementById("searchInputStore");
  const sendEmailButton = document.getElementById("sendEmailButton");

    const apiEndpoint = "https://sheetdb.io/api/v1/8ba1eug88u4y1"; // Replace with your actual API endpoint for Master Store List
  const bdmUsername = localStorage.getItem("username"); // Get logged-in BDM's username

  // Fetch the logged-in BDM data
  fetch(bdmApiEndpoint)
    .then(response => response.json())
    .then(bdmData => {
      // Assuming the API returns the BDM's username or ID; update as per your response structure
      bdmUsername = bdmData.username; // Adjust based on the actual field name from your API

      // Now fetch the store data and filter by the BDM
      fetch(storeApiEndpoint)
        .then(response => response.json())
        .then(storeData => {
          // Filter stores by the logged-in BDM's username
          const storesForBDM = storeData.filter(store => store["BDM"] === bdmUsername);

          // Function to display the stores
          function displayStores(stores) {
            storeListContainer.innerHTML = ""; // Clear previous results

            if (stores.length === 0) {
              storeListContainer.innerHTML = "<p>No stores found for this BDM.</p>";
            } else {
              stores.forEach(store => {
                const storeRow = document.createElement("tr");
                storeRow.innerHTML = `
                  <td><button class="visit-btn" data-store="${store["Customer Name"]}" data-store-id="${store["Store ID"]}">Visit</button></td>
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
                  const storeId = visitButton.getAttribute("data-store-id");
                  window.location.href = `visit.html?storeId=${storeId}`; // Redirect to visit.html with the store's ID
                });
              });
            }
          }

          // Display all stores for the BDM
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
            const selectedStores = document.querySelectorAll(".visit-btn:disabled");
            const storeNames = Array.from(selectedStores).map(button => button.getAttribute('data-store'));
            const emailBody = storeNames.join("\n");

            if (storeNames.length) {
              window.location.href = `mailto:?subject=Store Visits&body=${encodeURIComponent(emailBody)}`;
            }
          });
        })
        .catch(error => console.error("Error fetching store data:", error));
    })
    .catch(error => console.error("Error fetching BDM data:", error));
});
