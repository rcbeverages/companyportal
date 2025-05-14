document.addEventListener("DOMContentLoaded", async function () {
  const keyAccountListContainer = document.getElementById("storeList");
  const searchInput = document.getElementById("searchInputStore");
  const apiEndpoint = "https://sheetdb.io/api/v1/hklellq80sjc7"; // Replace with your actual API endpoint for Master Store List
  

  let allData = [];

  // Fetch and sort data by Segment
  try {
    const response = await fetch(API_URL);
    const rawData = await response.json();

    allData = rawData
      .filter(row => !row["Status"] || row["Status"] !== "Deleted")
      .sort((a, b) => {
        const segA = (a["Segment"] || "").toLowerCase();
        const segB = (b["Segment"] || "").toLowerCase();
        return segA.localeCompare(segB);
      });

    populateTable(allData);
    populateDropdowns(allData);
    populateSegmentOptions(allData);
  } catch (error) {
    console.error("Error fetching data:", error);
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

  function populateDropdowns(data) {
    const delSelect = document.getElementById("accountSelect");
    const editSelect = document.getElementById("editAccountSelect");
    delSelect.innerHTML = '<option value="">-- Select --</option>';
    editSelect.innerHTML = '<option value="">-- Select --</option>';

    data.forEach(account => {
      const name = account["Key Account Name"];
      const opt1 = new Option(name, name);
      const opt2 = new Option(name, name);
      delSelect.add(opt1);
      editSelect.add(opt2);
    });
  }

  function populateSegmentOptions(data) {
    const segments = [...new Set(data.map(row => row["Segment"]).filter(Boolean))].sort();
    const addSelect = document.getElementById("addSegmentSelect");
    const editSelect = document.getElementById("editSegmentSelect");

    [addSelect, editSelect].forEach(select => {
      select.innerHTML = '<option value="">-- Select Segment --</option>';
      segments.forEach(seg => {
        const opt = new Option(seg, seg);
        select.add(opt);
      });
    });
  }

  // Search function
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

  // Delete (PATCH to set Status = Deleted)
  document.getElementById("deleteKeyForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const selected = document.getElementById("accountSelect").value;
    if (!selected) return;

    fetch(`${API_URL}&search=Key Account Name&value=${encodeURIComponent(selected)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { Status: "Deleted" } })
    }).then(() => {
      alert("Key account marked as deleted.");
      location.reload();
    });
  });

  // Edit - load selected data
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

  // Edit - submit patch
  document.getElementById("editKeyForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const target = document.getElementById("editKeyAccountName").value;
    const data = {
      Segment: document.getElementById("editSegmentSelect").value,
      Contact: document.getElementById("editContact").value,
      Email: document.getElementById("editEmail").value,
      Mobile: document.getElementById("editMobile").value
    };

    console.log("PATCHING:", target, data); // Debug log

    fetch(`${API_URL}&search=Key Account Name&value=${encodeURIComponent(target)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data })
    }).then(() => {
      alert("Key account updated.");
      location.reload();
    });
  });
});I
