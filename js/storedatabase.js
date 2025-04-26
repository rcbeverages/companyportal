const username = localStorage.getItem("username");

const customerSheet = "https://sheetdb.io/api/v1/8ba1eug88u4y1"; // SheetDB API URL

const bdmMap = {
  rhincksman: "Ryan Hincksman",
  chawkins: "Chris Hawkins"
};

const bdmName = bdmMap[username];
let customerCache = [];

function loadCustomers() {
  fetch(customerSheet)
    .then(res => res.json())
    .then(data => {
      customerCache = data;
      const filtered = data.filter(c => c["BDM"] === bdmName);
      displayTiles(filtered);
    })
    .catch(error => {
      console.error("Error loading customers:", error);
      document.getElementById("customerTiles").innerHTML = "<p>Error loading store database.</p>";
    });
}

function displayTiles(data) {
  const container = document.getElementById("customerTiles");
  container.innerHTML = "";

  data.forEach(c => {
    const div = document.createElement("div");
    div.className = "tile";

    div.innerHTML = `
      <h3>${c["Customer Name"]}</h3>
      <p><strong>Sub Owner Group:</strong> ${c["Sub Owner Group"] || "N/A"}</p>
      <p><strong>Key Account Group:</strong> ${c["Key Account Group"] || "N/A"}</p>
      <p><strong>Grade:</strong> ${c["Grade"] || "N/A"}</p>
      <button class="visit-btn" onclick="startCall('${c["Customer Name"].replace(/'/g, "\\'")}')">Visit</button>
    `;

    container.appendChild(div);
  });
}

function filterTiles() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const tiles = document.querySelectorAll(".tile");
  tiles.forEach(tile => {
    const name = tile.querySelector("h3").textContent.toLowerCase();
    tile.style.display = name.includes(query) ? "block" : "none";
  });
}

function startCall(customerName) {
  const cleanName = customerName.trim().toLowerCase();
  const customer = customerCache.find(c => c["Customer Name"].trim().toLowerCase() === cleanName);

  if (customer) {
    localStorage.setItem("selectedCustomer", JSON.stringify(customer));
    window.location.href = "visit.html";
  } else {
    alert("Customer not found: " + customerName);
  }
}

window.onload = loadCustomers;
document.getElementById("searchInput").addEventListener("input", filterTiles);
