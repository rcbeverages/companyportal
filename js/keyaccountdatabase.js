document.addEventListener("DOMContentLoaded", function () {
  const keyAccountListContainer = document.getElementById("storeList");
  const searchInput = document.getElementById("searchInputStore");
  const apiURL = "https://sheetdb.io/api/v1/8ba1eug88u4y1?sheet=Key%20Accounts";

  let allData = [];

  // Fetch and display data
  fetch(apiURL)
    .then(response => response.json())
    .then(data => {
      allData = data.filter(row => row["Status"] !== "Deleted");
      populateTable(allData);
      populateDropdown(allData);
    });

  function populateTable(data) {
    keyAccountListContainer.innerHTML = "";
    if (data.length === 0) {
      keyAccountListContainer.innerHTML = "<tr><td colspan='7'>No key accounts available.</td></tr>";
      return;
    }

    data.forEach(account => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${account["Segment"]}</td>
        <td>${account["Vok Off Prem Key Accounts"]}</td>
        <td>${account["Outlets"]}</td>
        <td>${account["Contact"]}</td>
        <td>${account["Email"]}</td>
        <td>${account["Mobile"]}</td>
        <td>${account["Comments"]}</td>
      `;
      keyAccountListContainer.appendChild(row);
    });
  }

  function populateDropdown(data) {
    const select = document.getElementById("accountSelect");
    select.innerHTML = '<option value="">-- Select Account --</option>';
    data.forEach(account => {
      const opt = document.createElement("option");
      opt.value = account["Vok Off Prem Key Accounts"];
      opt.textContent = account["Vok Off Prem Key Accounts"];
      select.appendChild(opt);
    });
  }

  // Search
  searchInput.addEventListener("input", function () {
    const term = this.value.toLowerCase();
    const filtered = allData.filter(account =>
      Object.values(account).some(val => val.toLowerCase().includes(term))
    );
    populateTable(filtered);
  });

  // Open modals
  document.getElementById("addKeyAccountBtn").onclick = () => {
    document.getElementById("keyAccountModal").style.display = "block";
  };

  document.getElementById("deleteKeyAccountBtn").onclick = () => {
    document.getElementById("deleteKeyAccountModal").style.display = "block";
  };

  // Add Key Account
  document.getElementById("keyAccountForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data })
    }).then(res => res.json())
      .then(() => {
        alert("Key account added.");
        location.reload();
      });
  });

  // Delete (PATCH to mark as "Deleted")
  document.getElementById("deleteKeyForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const selected = document.getElementById("accountSelect").value;
    if (!selected) return;

    fetch(`https://sheetdb.io/api/v1/8ba1eug88u4y1?sheet=Key%20Accounts&search=Vok Off Prem Key Accounts&value=${encodeURIComponent(selected)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { Status: "Deleted" } })
    }).then(res => res.json())
      .then(() => {
        alert("Key account deleted.");
        location.reload();
      });
  });
});
