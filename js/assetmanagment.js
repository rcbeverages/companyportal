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

  // Fetch the asset data
  fetch(assetApiEndpoint)
    .then(response => response.json())
    .then(assetData => {
      displayAssets(assetData); // Display assets after fetching
    })
    .catch(error => console.error("Error fetching asset data:", error));

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
    displayAssets(filteredAssets); // Re-render the filtered list
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
    const customerName = document.getElementById("customerName").value;
    const agreement = document.getElementById("agreement").value;
    const datePlaced = document.getElementById("datePlaced").value;
    const status = document.getElementById("status").value;
    const comments = document.getElementById("comments").value;

    const newAsset = {
      "Asset Tag Code": assetTag,
      "Asset Type": assetType,
      "Customer Name": customerName,
      "Agreement": agreement,
      "Date Placed": datePlaced,
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
      closeModal(); // Close the modal after successful submission
      // Optionally, you can re-fetch the asset list and refresh the view
      fetch(assetApiEndpoint)
        .then(response => response.json())
        .then(assetData => {
          displayAssets(assetData); // Refresh asset list after adding new asset
        });
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
});
