document.addEventListener("DOMContentLoaded", function() {

  // === API Endpoints ===
  const customerSheet = "https://sheetdb.io/api/v1/8ba1eug88u4y1";
  const sheetUrl = "https://sheetdb.io/api/v1/8ba1eug88u4y1";
  const visitLogSheet = "https://sheetdb.io/api/v1/3jn3pg6hok7hj";
  const reminderSheet = "https://sheetdb.io/api/v1/lkhkbez8p8el9";
  const assetSheet = "https://sheetdb.io/api/v1/8kwtvisrhm2zd";
  const preorderSheet = "https://sheetdb.io/api/v1/autq91pb2wsab";

  // === Selected Customer from LocalStorage ===
  const customer = JSON.parse(localStorage.getItem("selectedCustomer"));

  if (!customer) {
    window.location.href = "storedatabase.html";
  } else {
    displayCustomerDetails(customer);
    loadPreorders();
    loadStoreRange();
  }

  // === Display Customer Details ===
  function displayCustomerDetails(cust) {
    document.getElementById("custName").textContent = cust["Customer Name"] || "";
    document.getElementById("subOwnerGroup").textContent = cust["Sub Owner Group"] || "";
    document.getElementById("keyAccountGroup").textContent = cust["Key Account Group"] || "";
    document.getElementById("grade").textContent = cust["Grade"] || "";
    document.getElementById("storeType").textContent = cust["Store Type"] || "";
    document.getElementById("segment").textContent = cust["Segment"] || "";
    document.getElementById("contactNameView").textContent = cust["Contact Name"] || "";
    document.getElementById("contactPhoneView").textContent = cust["Phone"] || "";
    document.getElementById("contactEmailView").textContent = cust["Email"] || "";
    document.getElementById("address").textContent = cust["Address"] || "";
    document.getElementById("suburb").textContent = cust["Suburb"] || "";
    document.getElementById("state").textContent = cust["State"] || "";
    document.getElementById("postcode").textContent = cust["Postcode"] || "";
    document.getElementById("bdmView").textContent = cust["BDM"] || "";
  }

  // === Toggle Collapsibles ===
  window.toggleSection = function(id) {
    const section = document.getElementById(id);
    section.classList.toggle('hidden');
  }

  // === Open Modals ===
  window.openStoreModal = function() {
    populateStoreFields();
    document.getElementById("storeModal").style.display = "block";
  }

  window.openContactModal = function() {
    populateContactFields();
    document.getElementById("contactModal").style.display = "block";
  }

  window.openAddressModal = function() {
    populateAddressFields();
    document.getElementById("addressModal").style.display = "block";
  }

  window.closeModal = function(id) {
    document.getElementById(id).style.display = "none";
  }

  // === Populate Edit Forms ===
  function populateStoreFields() {
    document.getElementById("editCustomerName").value = customer["Customer Name"] || "";
    populateDropdown("editSubOwnerGroup", "Sub Owner Group", customer["Sub Owner Group"]);
    populateDropdown("editKeyAccountGroup", "Key Account Group", customer["Key Account Group"]);
    populateDropdown("editGrade", "Grade", customer["Grade"]);
    populateDropdown("editStoreType", "Store Type", customer["Store Type"]);
    populateDropdown("editSegment", "Segment", customer["Segment"]);
    populateDropdown("editBDM", "BDM", customer["BDM"]);
  }

  function populateContactFields() {
    document.getElementById("editContactName").value = customer["Contact Name"] || "";
    document.getElementById("editPhone").value = customer["Phone"] || "";
    document.getElementById("editEmail").value = customer["Email"] || "";
  }

  function populateAddressFields() {
    document.getElementById("editAddress").value = customer["Address"] || "";
    document.getElementById("editSuburb").value = customer["Suburb"] || "";
    document.getElementById("editState").value = customer["State"] || "";
    document.getElementById("editPostcode").value = customer["Postcode"] || "";
  }

  // === Populate Dropdowns ===
  function populateDropdown(selectId, columnName, selectedValue) {
    fetch(`${customerSheet}?limit=1000`)
      .then(res => res.json())
      .then(data => {
        const uniqueOptions = [...new Set(data.map(row => row[columnName]).filter(Boolean))];
        const select = document.getElementById(selectId);
        select.innerHTML = "";

        if (selectId === "editSubOwnerGroup") {
          const blank = document.createElement("option");
          blank.value = "";
          blank.textContent = "";
          select.appendChild(blank);
        }

        uniqueOptions.sort().forEach(option => {
          const opt = document.createElement("option");
          opt.value = option;
          opt.textContent = option;
          if (option === selectedValue) opt.selected = true;
          select.appendChild(opt);
        });
      });
  }

  // === Save Store, Contact, Address Changes ===
  function saveCustomerFields(updatedFields) {
    fetch(`${sheetUrl}/Customer Name/${encodeURIComponent(customer["Customer Name"])}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: updatedFields })
    }).then(() => window.location.reload());
  }

  window.saveStoreInfo = function() {
    const updated = {
      "Customer Name": document.getElementById("editCustomerName").value.trim(),
      "Sub Owner Group": document.getElementById("editSubOwnerGroup").value,
      "Key Account Group": document.getElementById("editKeyAccountGroup").value,
      "Grade": document.getElementById("editGrade").value,
      "Store Type": document.getElementById("editStoreType").value,
      "Segment": document.getElementById("editSegment").value,
      "BDM": document.getElementById("editBDM").value
    };
    saveCustomerFields(updated);
    closeModal("storeModal");
  }

  window.saveContactInfo = function() {
    const updated = {
      "Contact Name": document.getElementById("editContactName").value.trim(),
      "Phone": document.getElementById("editPhone").value.trim(),
      "Email": document.getElementById("editEmail").value.trim()
    };
    saveCustomerFields(updated);
    closeModal("contactModal");
  }

  window.saveAddressInfo = function() {
    const updated = {
      "Address": document.getElementById("editAddress").value.trim(),
      "Suburb": document.getElementById("editSuburb").value.trim(),
      "State": document.getElementById("editState").value.trim(),
      "Postcode": document.getElementById("editPostcode").value.trim()
    };
    saveCustomerFields(updated);
    closeModal("addressModal");
  }

  // === Load Preorders ===
  function loadPreorders() {
    fetch(`${preorderSheet}?Customer%20Name=${encodeURIComponent(customer["Customer Name"])}`)
      .then(res => res.json())
      .then(data => {
        const preorderContainer = document.getElementById("preorderContainer");
        preorderContainer.innerHTML = "";

        const skus = ["Creamy Soda", "Sarsaparilla", "Blueberry Rasp", "Portello", "LLB", "Rasp Lemonade"];

        skus.forEach(sku => {
          const div = document.createElement("div");
          div.className = "form-group";
          div.innerHTML = `
            <label>${sku}</label>
            <select id="yesno_${sku.replace(/\s+/g, '')}" onchange="toggleQTY('${sku}')">
              <option>No</option>
              <option>Yes</option>
            </select>
            <input type="number" id="qty_${sku.replace(/\s+/g, '')}" placeholder="QTY" style="display:none;margin-top:5px;" />
          `;
          preorderContainer.appendChild(div);
        });

        if (data.length > 0) {
          skus.forEach(sku => {
            const cleanSku = sku.replace(/\s+/g, '');
            if (data[0][`QTY - ${sku}`]) {
              document.getElementById(`yesno_${cleanSku}`).value = "Yes";
              document.getElementById(`qty_${cleanSku}`).style.display = "block";
              document.getElementById(`qty_${cleanSku}`).value = data[0][`QTY - ${sku}`];
            }
          });
        }
      });
  }

  // === Show/Hide Qty Based on Yes/No ===
  window.toggleQTY = function(sku) {
    const cleanSku = sku.replace(/\s+/g, '');
    const yesno = document.getElementById(`yesno_${cleanSku}`).value;
    const qty = document.getElementById(`qty_${cleanSku}`);
    qty.style.display = (yesno === "Yes") ? "block" : "none";
  }

  // === Load Store Range ===
  function loadStoreRange() {
    fetch(`${customerSheet}?Customer%20Name=${encodeURIComponent(customer["Customer Name"])}`)
      .then(res => res.json())
      .then(data => {
        const storeRangeContainer = document.getElementById("storeRangeContainer");
        storeRangeContainer.innerHTML = "";

        const brandGroups = {};

        if (data.length > 0) {
          const range = JSON.parse(data[0]["Store Range"] || "{}");

          Object.keys(range).forEach(product => {
            const [brand, sku] = product.split(" - ");
            if (!brandGroups[brand]) brandGroups[brand] = [];
            brandGroups[brand].push({ sku, ranged: range[product] === "Yes" });
          });

          Object.keys(brandGroups).forEach(brand => {
            const brandDiv = document.createElement("div");
            brandDiv.innerHTML = `<h4>${brand}</h4>`;
            storeRangeContainer.appendChild(brandDiv);

            brandGroups[brand].forEach(item => {
              const div = document.createElement("div");
              div.className = "form-group";
              div.innerHTML = `
                <label>
                  <input type="checkbox" ${item.ranged ? "checked" : ""} id="range_${brand}_${item.sku.replace(/\s+/g, '')}" />
                  ${item.sku}
                </label>
              `;
              storeRangeContainer.appendChild(div);
            });
          });
        }
      });
  }

  // === Save Everything ===
  window.saveEverything = function() {
    const now = new Date();
    const visitReason = document.getElementById("reason").value;
    const outcome = document.getElementById("outcome").value;
    const notes = document.getElementById("notes").value.trim();

    if (visitReason && notes && (visitReason === "Planned Visit" || visitReason === "Tasting")) {
      const visit = {
        "Date": now.toISOString().split("T")[0],
        "Timestamp": now.toLocaleString(),
        "Customer Name": customer["Customer Name"],
        "BDM": customer["BDM"],
        "Visit Reason": visitReason,
        "Outcome": outcome,
        "Notes": notes,
        "Status": "Completed"
      };
      fetch(visitLogSheet, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: visit })
      });
    }

    const reminderDate = document.getElementById("reminderDate").value;
    const reminderNotes = document.getElementById("reminderNotes").value.trim();
    if (reminderDate) {
      fetch(reminderSheet, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: {
          "Date to Email": reminderDate,
          "Customer Name": customer["Customer Name"],
          "BDM": customer["BDM"],
          "Comments": reminderNotes
        } })
      });
    }

    const assetType = document.getElementById("assetType").value.trim();
    const assetTag = document.getElementById("assetTag").value.trim();
    const agreement = document.getElementById("assetAgreement").value.trim();
    const assetComments = document.getElementById("assetComments").value.trim();
    if (assetType && assetTag && agreement && assetComments) {
      fetch(assetSheet, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: {
          "Customer Name": customer["Customer Name"],
          "Asset Type": assetType,
          "Asset Tag Code": assetTag,
          "Agreement": agreement,
          "Asset Comments": assetComments
        } })
      });
    }

    const preorderData = {};
    const skus = ["Creamy Soda", "Sarsaparilla", "Blueberry Rasp", "Portello", "LLB", "Rasp Lemonade"];
    skus.forEach(sku => {
      const cleanSku = sku.replace(/\s+/g, '');
      if (document.getElementById(`yesno_${cleanSku}`).value === "Yes") {
        preorderData[`QTY - ${sku}`] = document.getElementById(`qty_${cleanSku}`).value || "1";
      }
    });

    if (Object.keys(preorderData).length > 0) {
      fetch(`${preorderSheet}?Customer%20Name=${encodeURIComponent(customer["Customer Name"])}`)
        .then(res => res.json())
        .then(existing => {
          const method = existing.length ? "PATCH" : "POST";
          const url = existing.length
            ? `${preorderSheet}/Customer%20Name/${encodeURIComponent(customer["Customer Name"])}`
            : preorderSheet;
          fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: { "Customer Name": customer["Customer Name"], ...preorderData } })
          });
        });
    }

    alert("Save / End Call Completed");
    window.location.href = "dashboard.html";
  }

});
