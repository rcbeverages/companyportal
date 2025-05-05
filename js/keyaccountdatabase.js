document.addEventListener("DOMContentLoaded", function () {
  const apiURL = "https://sheetdb.io/api/v1/8ba1eug88u4y1?sheet=Key%20Accounts";
  const keyAccountListContainer = document.getElementById("storeList");
  const searchInput = document.getElementById("searchInputStore");

  let allData = [];

  // Load data
  fetch(apiURL)
    .then(response => response.json())
    .then(data => {
      allData = data.filter(row => row["Status"] !== "Deleted");
      populateTable(allData);
      populateDropdowns(allData);
      populateSegmentOptions(allData);
    });

  function populateTable(data) {
    keyAccountListContainer.innerHTML = "";
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

  function populateDropdowns(data) {
    const delSelect = document.getElementById("accountSelect");
    const editSelect = document.getElementById("editAccountSelect");
    delSelect.innerHTML = '<option value="">-- Select Account --</option>';
    editSelect.innerHTML = '<option value="">-- Select Account --</option>';

    data.forEach(account => {
      const name = account["Vok Off Prem Key Accounts"];
      const opt1 = document.createElement("option");
      opt1.value = name;
      opt1.textContent = name;
      delSelect.appendChild(opt1);

      const opt2 = opt1.cloneNode(true);
      editSelect.appendChild(opt2);
    });
  }

  function populateSegmentOptions(data) {
    const segmentSelect = document.getElementById("editSegmentSelect");
    const segments = [...new Set(data.map(row => row["Segment"]))].sort();
    segments.forEach(seg => {
      const opt = document.createElement("option");
      opt.value = seg;
      opt.textContent = seg;
      segmentSelect.appendChild(opt);
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

  // Show modals
  document.getElementById("addKeyAccountBtn").onclick = () => {
    document.getElementById("keyAccountModal").style.display = "block";
  };
  document.getElementById("deleteKeyAccountBtn").onclick = () => {
    document.getElementById("deleteKeyAccountModal").style.display = "block";
  };
  document.getElementById("editKeyAccountBtn").onclick = () => {
    document.getElementById("editKeyAccountModal").style.display = "block";
  };

  // Add
  document.getElementById("keyAccountForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data })
    }).then(() => {
      alert("Key account added.");
      location.reload();
    });
  });

  // Delete
  document.getElementById("deleteKeyForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const selected = document.getElementById("accountSelect").value;
    if (!selected) return;

    fetch(`${apiURL}&search=Vok Off Prem Key Accounts&value=${encodeURIComponent(selected)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { Status: "Deleted" } })
    }).then(() => {
      alert("Deleted.");
      location.reload();
    });
  });

  // Edit dropdown change: autofill form
  document.getElementById("editAccountSelect").addEventListener("change", function () {
    const selected = this.value;
    const record = allData.find(row => row["Vok Off Prem Key Accounts"] === selected);
    if (!record) return;

    document.getElementById("editKeyAccountName").value = record["Vok Off Prem Key Accounts"];
    document.getElementById("editSegmentSelect").value = record["Segment"];
    document.getElementById("editOutlets").value = record["Outlets"] || "";
    document.getElementById("editContact").value = record["Contact"] || "";
    document.getElementById("editEmail").value = record["Email"] || "";
    document.getElementById("editMobile").value = record["Mobile"] || "";
    document.getElementById("editComments").value = record["Comments"] || "";
  });

  // Edit form submit
  document.getElementById("editKeyForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const patchTarget = document.getElementById("editKeyAccountName").value;
    const data = {
      Segment: document.getElementById("editSegmentSelect").value,
      Outlets: document.getElementById("editOutlets").value,
      Contact: document.getElementById("editContact").value,
      Email: document.getElementById("editEmail").value,
      Mobile: document.getElementById("editMobile").value,
      Comments: document.getElementById("editComments").value
    };

    fetch(`${apiURL}&search=Vok Off Prem Key Accounts&value=${encodeURIComponent(patchTarget)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data })
    }).then(() => {
      alert("Changes saved.");
      location.reload();
    });
  });
});
