document.addEventListener("DOMContentLoaded", function() {
  const assetListContainer = document.getElementById("assetList");
  const searchInput = document.getElementById("searchInputAsset");
  const assetApiEndpoint = "https://sheetdb.io/api/v1/8kwtvisrhm2zd"; // Correct SheetDB API endpoint
  const availableAssetsApiEndpoint = "https://sheetdb.io/api/v1/8kwtvisrhm2zd/search?Status=Available";
  const placedAssetsApiEndpoint = "https://sheetdb.io/api/v1/8kwtvisrhm2zd/search?Status=Placed";
  const assetModal = document.getElementById("assetModal");

  // Function to display assets in the table
  function displayAssets(assets) {
    console.log("Fetched assets:", assets);  // Log fetched assets for debugging
    assetListContainer.innerHTML = ""; // Clear previous results

    if (assets.length === 0) {
      assetListContainer.innerHTML = "<p>No assets found.</p>";
    } else {
      assets.forEach(asset => {
        const assetRow = document.createElement("tr");
        assetRow.innerHTML = `
          <td>${asset["Asset Tag Code"]}</td>
          <td>${asset["Asset Type"]}</td>
          <td>${asset["Customer Name"]}</td>
          <td>${asset["Agreement"]}</td>
          <td>${asset["Status"]}</td>  <!-- Display Status -->
          <td>${asset["Comments"]}</td>
        `;
        assetListContainer.appendChild(assetRow);
      });
    }
  }

  // Function to fetch available assets
  function showAvailableAssets() {
    fetch(availableAssetsApiEndpoint)
      .then(response => response.json())  // Parse JSON data from API response
      .then(assetData => {
        console.log("Fetched Available Assets:", assetData); // Log the data for debugging
        displayAssets(assetData);  // Display available assets
      })
      .catch(error => console.error("Error fetching available asset data:", error));
  }

  // Function to fetch placed assets
  function showPlacedAssets() {
    fetch(placedAssetsApiEndpoint)
      .then(response => response.json())  // Parse JSON data from API response
      .then(assetData => {
        console.log("Fetched Placed Assets:", assetData); // Log the data for debugging
        displayAssets(assetData);  // Display placed assets
      })
      .catch(error => console.error("Error fetching placed asset data:", error));
  }

  // Modal functionality
  function openModal() {
    assetModal.style.display = "block"; // Open modal
  }

  function closeModal() {
    assetModal.style.display = "none"; // Close modal
  }

  // Add asset functionality
 document.getElementById("addAssetForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form from reloading the page

  const assetTag = document.getElementById("assetTag") ? document.getElementById("assetTag").value : '';
  const assetType = document.getElementById("assetType") ? document.getElementById("assetType").value : '';
  const status = document.getElementById("status") ? document.getElementById("status").value : '';

  const newAsset = {
    "Asset Tag Code": assetTag,
    "Asset Type": assetType,
    "Status": status
  };

  // POST request to add the new asset to SheetDB
  fetch(assetApiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify([newAsset])
  })
  .then(response => response.json())
  .then(data => {
    console.log("Asset added:", data);
    closeModal(); // Close the modal after success
    showAvailableAssets(); // Refresh the asset list
  })
  .catch(error => console.error("Error adding asset:", error));
});

  // Event listeners for buttons
  document.getElementById("availableAssetsBtn").addEventListener("click", showAvailableAssets);
  document.getElementById("placedAssetsBtn").addEventListener("click", showPlacedAssets);
  document.getElementById("addAssetBtn").addEventListener("click", openModal);

  // Fetch assets on page load (default fetch of available assets)
  showAvailableAssets(); // Initial asset list fetch when the page loads
});
