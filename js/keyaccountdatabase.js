document.addEventListener("DOMContentLoaded", function() {
  const storeListContainer = document.getElementById("keyAccountList");
  const selectAllButton = document.getElementById("selectAllButton");
  const searchInput = document.getElementById("searchInputEmail");
  const sendEmailButton = document.getElementById("sendEmailButton");

  const apiEndpoint = "https://sheetdb.io/api/v1/8ba1eug88u4y1/Key Accounts";
  const bdmUsername = localStorage.getItem("username");

  fetch(apiEndpoint)
    .then(response => response.json())
    .then(data => {
      const accountsForBDM = data.filter(store => store["BDM or KAM Call?"] === bdmUsername && store["Email"]);

      function displayAccounts(accounts) {
        storeListContainer.innerHTML = "";

        if (accounts.length === 0) {
          storeListContainer.innerHTML = "<p>No key accounts found for this BDM.</p>";
        } else {
          accounts.forEach(store => {
            const storeRow = document.createElement("tr");
            storeRow.innerHTML = `
              <td>${store["Segment"]}</td>
              <td>${store["Account Name"]}</td>
              <td>${store["Outlets"]}</td>
              <td>${store["Contact"]}</td>
              <td><a href="mailto:${store["Email"]}" target="_blank">${store["Email"]}</a></td>
              <td>${store["Mobile"]}</td>
              <td>${store["Comments"]}</td>
            `;
            storeListContainer.appendChild(storeRow);
          });
        }
      }

      displayAccounts(accountsForBDM);

      searchInput.addEventListener("input", function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredAccounts = accountsForBDM.filter(store => {
          return (
            store["Segment"].toLowerCase().includes(searchTerm) ||
            store["Vok Off Prem Key Accounts"].toLowerCase().includes(searchTerm) ||
            store["Outlets"].toLowerCase().includes(searchTerm) ||
            store["Contact"].toLowerCase().includes(searchTerm) ||
            store["Email"].toLowerCase().includes(searchTerm)
          );
        });
        displayAccounts(filteredAccounts);
      });

      selectAllButton.addEventListener("click", function() {
        const checkboxes = document.querySelectorAll(".select-store");
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
        checkboxes.forEach(checkbox => checkbox.checked = !allChecked);
      });

      sendEmailButton.addEventListener("click", function() {
        const selectedStores = document.querySelectorAll(".select-store:checked");
        const storeEmails = Array.from(selectedStores).map(checkbox => checkbox.getAttribute('data-store-email'));
        const bccEmails = storeEmails.join(',');

        if (bccEmails) {
          const mailtoLink = `mailto:?bcc=${bccEmails}&subject=Key Account Contact&body=Please%20find%20key%20contacts%20below:%0A%0A${encodeURIComponent(storeEmails.join('\n'))}`;
          window.location.href = mailtoLink;
        } else {
          alert("Please select at least one contact to email.");
        }
      });

    })
    .catch(error => console.error("Error fetching key account data:", error));
});
