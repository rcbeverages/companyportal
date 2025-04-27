// API Endpoints
const availableAssetsAPI = "https://sheetdb.io/api/v1/8kwtvisrhm2zd/search?Status=Available";
const placedAssetsAPI = "https://sheetdb.io/api/v1/8kwtvisrhm2zd/search?Status=Placed";

// Function to create a row-style asset tile
function createAssetTile(asset, type) {
  const tile = document.createElement('div');
  tile.className = 'tile';

  if (type === 'available') {
    tile.innerHTML = `
      <div class="tile-row">
        <div><strong>Asset Tag:</strong> ${asset["Asset Tag Code"] || ""}</div>
        <div><strong>Type:</strong> ${asset["Asset Type"] || ""}</div>
        <div><strong>Agreement:</strong> ${asset["Agreement"] || ""}</div>
        <div><strong>Status:</strong> ${asset["Status"] || ""}</div>
        <div><strong>Comments:</strong> ${asset["Comments"] || ""}</div>
      </div>
    `;
  } else if (type === 'placed') {
    tile.innerHTML = `
      <div class="tile-row">
        <div><strong>Asset Tag:</strong> ${asset["Asset Tag Code"] || ""}</div>
        <div><strong>Type:</strong> ${asset["Asset Type"] || ""}</div>
        <div><strong>Customer:</strong> ${asset["Customer Name"] || ""}</div>
        <div><strong>Agreement:</strong> ${asset["Agreement"] || ""}</div>
        <div><strong>Date Placed:</strong> ${asset["Date Placed"] || ""}</div>
        <div><strong>Status:</strong> ${asset["Status"] || ""}</div>
        <div><strong>Comments:</strong> ${asset["Comments"] || ""}</div>
      </div>
    `;
  }

  return tile;
}

// Fetch and Display Available Assets
fetch(availableAssetsAPI)
  .then(response => response.json())
  .then(data => {
    const availableAssetsList = document.getElementById('availableAssetsList');
    if (data.length === 0) {
      availableAssetsList.innerHTML = "<p>No available assets found.</p>";
    } else {
      data.forEach(asset => {
        const tile = createAssetTile(asset, 'available');
        availableAssetsList.appendChild(tile);
      });
    }
  })
  .catch(error => console.error('Error fetching available assets:', error));

// Fetch and Display Placed Assets
fetch(placedAssetsAPI)
  .then(response => response.json())
  .then(data => {
    const placedAssetsList = document.getElementById('placedAssetsList');
    if (data.length === 0) {
      placedAssetsList.innerHTML = "<p>No placed assets found.</p>";
    } else {
      data.forEach(asset => {
        const tile = createAssetTile(asset, 'placed');
        placedAssetsList.appendChild(tile);
      });
    }
  })
  .catch(error => console.error('Error fetching placed assets:', error));
