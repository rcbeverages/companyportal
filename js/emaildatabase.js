document.addEventListener("DOMContentLoaded", function() {
  // Set Username from Local Storage (like other pages)
  const username = localStorage.getItem("username");
  document.getElementById("username").textContent = username;

  // Function to fetch and display store list (this is just a sample implementation)
  function fetchStoreList() {
    // Placeholder: You would replace this with your dynamic data-fetching logic, e.g., API calls.
    const storeList = [
      { storeName: "Store 1", subOwner: "Owner 1", grade: "A", keyAccount: "Yes", storeType: "Retail" },
      { storeName: "Store 2", subOwner: "Owner 2", grade: "B", keyAccount: "No", storeType: "Wholesale" },
    ];

    const storeListContainer = document.getElementById("storeList");
    storeListContainer.innerHTML = ""; // Clear any previous content

    // Populate the store list dynamically
    storeList.forEach(store => {
      const storeDiv = document.createElement("div");
      storeDiv.className = "store-item";
      storeDiv.innerHTML = `
        <h3>${store.storeName}</h3>
        <p>Sub Owner: ${store.subOwner}</p>
        <p>Grade: ${store.grade}</p>
        <p>Key Account: ${store.keyAccount}</p>
        <p>Store Type: ${store.storeType}</p>
      `;
      storeListContainer.appendChild(storeDiv);
    });
  }

  // Call fetchStoreList to display data
  fetchStoreList();

  // Enable the 'Send Email' button when there is search input
  const searchInput = document.getElementById("searchInput");
  const sendEmailButton = document.getElementById("sendEmailButton");

  searchInput.addEventListener("input", function() {
    if (searchInput.value.length > 0) {
      sendEmailButton.disabled = false;
    } else {
      sendEmailButton.disabled = true;
    }
  });
});
