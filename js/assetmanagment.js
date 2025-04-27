document.addEventListener("DOMContentLoaded", function() {
  const assetListContainer = document.getElementById("assetList");
  const searchInput = document.getElementById("searchInputAsset");
  const assetApiEndpoint = "https://sheetdb.io/api/v1/8kwtvisrhm2zd"; // Correct SheetDB API endpoint
  const availableAssetsApiEndpoint = "https://sheetdb.io/api/v1/8kwtvisrhm2zd/search?Status=Available";
  const placedAssetsApiEndpoint = "https://sheetdb.io/api/v1/8kwtvisrhm2zd/search?Status=Placed";
  const assetModal = document.getElementById("assetModal");

  // Function to display assets in the table
  function displayAssets(assets) {
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
      .then(response => response.json())
      .then(assetData => {
        displayAssets(assetData); // Display available assets after fetching
      })
      .catch(error => console.error("Error fetching available asset data:", error));
  }

  // Function to fetch placed assets
  function showPlacedAssets() {
    fetch(placedAssetsApiEndpoint)
      .then(response => response.json())
      .then(assetData => {
        displayAssets(assetData); // Display placed assets after fetching
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
    event.preventDefault();

    const assetTag = document.getElementById("assetTag").value;
    const assetType = document.getElementById("assetType").value;
    const status = document.getElementById("status").value;
    const comments = document.getElementById("comments").value;

    const newAsset = {
      "Asset Tag Code": assetTag,
      "Asset Type": assetType,
      "Status": status,
      "Comments": comments
    };

    // Make a POST request to add the new asset to the Google Sheet via SheetDB API
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
      closeModal();
      // Refresh the asset list to show the new asset
      showAvailableAssets();  // Fetch and show available assets after adding a new asset
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
