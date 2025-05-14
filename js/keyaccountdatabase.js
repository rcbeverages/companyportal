document.addEventListener("DOMContentLoaded", async function () {
  const API_URL = "https://sheetdb.io/api/v1/hklellq80sjc7";
  const keyAccountListContainer = document.getElementById("storeList");
  const searchInput = document.getElementById("searchInputStore");
  const tableHeaders = ["Segment", "Key Account Name", "Contact", "Mobile", "Email"];

  let allData = [];
  let currentSort = { column: "Segment", direction: "asc" };

  // Fetch and display
  try {
    const response = await fetch(API_URL);
    const rawData = await response.json();

    allData = rawData.filter(row => !row["Status"] || row["Status"] !== "Deleted");
    sortAndRender(currentSort.column, currentSort.direction);
    populateDropdowns(allData);
    populateSegmentOptions(allData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  function sortAndRender(column, direction) {
    currentSort = { column, direction };

    const sorted = [...allData].sort((a, b) => {
      const valA = (a[column] || "").toLowerCase();
      const valB = (b[column] || "").toLowerCase();
      return direction === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

    populateTable(sorted);
  }

  function populateTable(data) {
    keyAccountListContainer.innerHTML = "";
    data.forEach(account => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${account["Segment"]}</td>
        <td>${account["Key Account Name"]}</td>
        <td>${account["Contact"]}</td>
        <td>${account["Mobile"]}</td>
        <td><a href="mailto:${account["Email"]}">${account["Email"]}</a></td>
      `;
      keyAccountListContainer.appendChild(row);
    });
  }

  // Sort by clicking headers
  document.querySelectorAll("thead th").forEach(th => {
    const colName = th.innerText.trim();
    if (tableHeaders.includes(colName)) {
      th.style.cursor = "pointer";
      th.addEventListener("click", () => {
        const newDir = currentSort.column === colName && currentSort.direction === "asc" ? "desc" : "asc";
        sortAndRender(colName, newDir);
      });
    }
  });

  function populateDropdowns(data) {
    const delSelect = document.getElementById("accountSelect");
    const editSelect = document.getElementById("editAccountSelect");
    delSelect.innerHTML = '<option value="">-- Select --</option>';
    editSelect.innerHTML = '<option value="">-- Select --</option>';

    data.forEach(account => {
      const name = account["Key Account Name"];
      if (name) {
        delSelect.add(new Option(name, name));
        editSelect.add(new Option(name, name));
      }
    });
  }

  function populateSegmentOptions(data) {
    const segments = [...new Set(data.map(row => row["Segment"]).filter(Boolean))].sort();
    const addSelect = document.getElementById("addSegmentSelect");
    const editSelect = document.getElementById("editSegmentSelect");

    [addSelect, editSelect].forEach(select => {
      select.innerHTML = '<option value="">-- Select Segment --</option>';
      segments.forEach(seg => {
        select.add(new Option(seg, seg));
      });
    });
  }

  searchInput.addEventListener("input", function () {
    const term = this.value.toLowerCase();
    const filtered = allData.filter(account =>
      Object.values(account).some(val => val.toLowerCase().includes(term))
    );
    populateTable(filtered);
  });

  // Show modals
  document.getElementById("addKeyAccountBtn").onclick = () =>
    document.getElementById("keyAccountModal").style.display = "block";

  document.getElementById("deleteKeyAccountBtn").onclick = () =>
    document.getElementById("deleteKeyAccountModal").style.display = "block";

  document.getElementById("editKeyAccountBtn").onclick = () =>
    document.getElementById("editKeyAccountModal").style.display = "block";

  // Add
  document.getElementById("keyAccountForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    fetch(API_URL, {
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

    const patchUrl = `${API_URL}/search?Key%20Account%20Name=${encodeURIComponent(selected)}`;
    console.log("PATCH delete:", patchUrl);

    fetch(patchUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { Status: "Deleted" } })
    }).then(() => {
      alert("Key account deleted.");
      location.reload();
    });
  });

  // Load Edit Form
  document.getElementById("editAccountSelect").addEventListener("change", function () {
    const selected = this.value;
    const record = allData.find(row => row["Key Account Name"] === selected);
    if (!record) return;

    document.getElementById("editKeyAccountName").value = record["Key Account Name"] || "";
    document.getElementById("editSegmentSelect").value = record["Segment"] || "";
    document.getElementById("editContact").value = record["Contact"] || "";
    document.getElementById("editMobile").value = record["Mobile"] || "";
    document.getElementById("editEmail").value = record["Email"] || "";
  });

  // Submit Edit
  document.getElementById("editKeyForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const target = document.getElementById("editKeyAccountName").value;
    const data = {
      Segment: document.getElementById("editSegmentSelect").value,
      Contact: document.getElementById("editContact").value,
      Email: document.getElementById("editEmail").value,
      Mobile: document.getElementById("editMobile").value
    };

    const patchUrl = `${API_URL}/search?Key%20Account%20Name=${encodeURIComponent(target)}`;
    console.log("PATCH edit:", patchUrl, data);

    fetch(patchUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data })
    }).then(() => {
      alert("Key account updated.");
      location.reload();
    });
  });
});
