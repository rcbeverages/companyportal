document.addEventListener("DOMContentLoaded", function() {
  const assetListContainer = document.getElementById("assetList");
  const searchInput = document.getElementById("searchInputAsset");

  const assetApiEndpoint = "https://sheetdb.io/api/v1/8kwtvisrhm2zd"; // Replace with your actual Asset API endpoint

  // Fetch the asset data
  fetch(assetApiEndpoint)
    .then(response => response.json())
    .then(assetData => {
      // Function to display the assets
      function displayAssets(assets) {
        assetListContainer.innerHTML = ""; // Clear previous results

        if (assets.length === 0) {
          assetListContainer.innerHTML = "<p>No assets found.</p>";
        } else {
          assets.forEach(asset => {
            const assetRow = document.createElement("tr");
            assetRow.innerHTML = `
              <td><button class="visit-btn" data-asset="${asset["Asset Tag Code"]}" data-asset-id="${asset["Asset Tag Code"]}">Visit</button></td>
              <td>${asset["Asset Tag Code"]}</td>
              <td>${asset["Asset Type"]}</td>
              <td>${asset["Customer Name"]}</td>
              <td>${asset["Agreement"]}</td>
              <td>${asset["Status"]}</td>
              <td>${asset["Comments"]}</td>
            `;
            assetListContainer.appendChild(assetRow);

            // Add event listener to the Visit button
            const visitButton = assetRow.querySelector(".visit-btn");
            visitButton.addEventListener("click", function() {
              const assetId = visitButton.getAttribute("data-asset-id");
              window.location.href = `visit.html?assetId=${assetId}`; // Redirect to visit.html with the asset's ID
            });
          });
        }
      }

      // Display all assets
      displayAssets(assetData);

      // Search functionality (applies on input event of the search field)
      searchInput.addEventListener("input", function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredAssets = assetData.filter(asset => {
          return (
            asset["Asset Tag Code"].toLowerCase().includes(searchTerm) ||
            asset["Asset Type"].toLowerCase().includes(searchTerm) ||
            asset["Customer Name"].toLowerCase().includes(searchTerm) ||
            asset["Agreement"].toLowerCase().includes(searchTerm)
          );
        });
        displayAssets(filteredAssets);
      });
    })
    .catch(error => console.error("Error fetching asset data:", error));
});
