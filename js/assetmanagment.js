document.addEventListener("DOMContentLoaded", function() {
  const assetListContainer = document.getElementById("assetList");
  const searchInput = document.getElementById("searchInputAsset");
  const assetApiEndpoint = "https://sheetdb.io/api/v1/8kwtvisrhm2zd"; // Replace with your actual Asset API endpoint
  const assetModal = document.getElementById("assetModal");
  
  // Function to display assets
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
          <td>${asset["Status"]}</td>
          <td>${asset["Comments"]}</td>
        `;
        assetListContainer.appendChild(assetRow);
      });
    }
  }

  // Fetch the asset data
  function fetchAssets() {
    fetch(assetApiEndpoint)
      .then(response => response.json())
      .then(assetData => {
        displayAssets(assetData); // Display assets after fetching
      })
      .catch(error => console.error("Error fetching asset data:", error));
  }

  // Search functionality (applies on input event of the search field)
  searchInput.addEventListener("input", function() {
    const searchTerm = searchInput.value.toLowerCase();
    fetch(assetApiEndpoint)
      .then(response => response.json())
      .then(assetData => {
        const filteredAssets = assetData.filter(asset => {
          return (
            asset["Asset Tag Code"].toLowerCase().includes(searchTerm) ||
            asset["Asset Type"].toLowerCase().includes(searchTerm) ||
            asset["Customer Name"].toLowerCase().includes(searchTerm) ||
            asset["Agreement"].toLowerCase().includes(searchTerm)
          );
        });
        displayAssets(filteredAssets); // Re-render the filtered list
      });
  });

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
      // Optionally, refresh the asset list to show the new asset
      fetchAssets();  // Fetches the updated list of assets
    })
    .catch(error => console.error("Error adding asset:", error));
  });

  // Close modal if clicked outside
  window.onclick = function(event) {
    if (event.target === assetModal) {
      closeModal();
    }
  };

  // Add New Asset button
  document.querySelector(".add-button").addEventListener("click", openModal);

  // Fetch assets on page load
  fetchAssets(); // Initial asset list fetch when the page loads
});
