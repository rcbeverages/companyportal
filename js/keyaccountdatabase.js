document.addEventListener("DOMContentLoaded", function() {
  // 🔐 Require login
  const bdmUsername = localStorage.getItem("username");
  if (!bdmUsername) {
    window.location.href = "login.html";
    return;
  }

  const keyAccountListContainer = document.getElementById("keyAccountList");
  const searchInput = document.getElementById("searchInputKey");
  const selectAllButton = document.getElementById("selectAllKeyButton");
  const sendEmailButton = document.getElementById("sendKeyEmailButton");

  const keyAccountApiEndpoint = "https://sheetdb.io/api/v1/8ba1eug88u4y1?sheet=Key%20Accounts";

  fetch(keyAccountApiEndpoint)
    .then(response => response.json())
    .then(data => {
      function displayKeyAccounts(list) {
        keyAccountListContainer.innerHTML = "";

        if (list.length === 0) {
          keyAccountListContainer.innerHTML = "<p>No key accounts found.</p>";
        } else {
          list.forEach(account => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td><button class="visit-btn" data-name="${account["Vok Off Prem Key Accounts"]}">Visit</button></td>
              <td>${account["Segment"]}</td>
              <td>${account["Account Name"]}</td>
              <td>${account["Outlets"]}</td>
              <td>${account["Contact"]}</td>
              <td>${account["Email"]}</td>
              <td>${account["Mobile"]}</td>
              <td>${account["Comments"]}</td>
            `;
            keyAccountListContainer.appendChild(row);

            row.querySelector(".visit-btn").addEventListener("click", function() {
              const storeName = this.getAttribute("data-name");
              window.location.href = `visit.html?storeName=${encodeURIComponent(storeName)}`;
            });
          });
        }
      }

      displayKeyAccounts(data);

      searchInput.addEventListener("input", function() {
        const term = searchInput.value.toLowerCase();
        const results = data.filter(account =>
          Object.values(account).some(val =>
            val.toLowerCase().includes(term)
          )
        );
        displayKeyAccounts(results);
      });

      selectAllButton.addEventListener("click", function() {
        const buttons = document.querySelectorAll(".visit-btn");
        const allDisabled = Array.from(buttons).every(btn => btn.disabled);
        buttons.forEach(btn => btn.disabled = !allDisabled);
      });

      sendEmailButton.addEventListener("click", function() {
        const selected = document.querySelectorAll(".visit-btn:disabled");
        const names = Array.from(selected).map(btn => btn.getAttribute("data-name"));
        if (names.length) {
          window.location.href = `mailto:?subject=Key Account Visits&body=${encodeURIComponent(names.join("\n"))}`;
        }
      });
    })
    .catch(err => console.error("Error loading key account data:", err));
});
