document.addEventListener("DOMContentLoaded", function() {
  // Placeholder: Replace this with an actual API call to fetch customer data
  const customerData = [
    { customerName: "Customer 1", subOwnerGroup: "Group A", keyAccountGroup: "Yes", grade: "A", storeType: "Retail", email: "customer1@example.com" },
    { customerName: "Customer 2", subOwnerGroup: "Group B", keyAccountGroup: "No", grade: "B", storeType: "Wholesale", email: "customer2@example.com" },
    { customerName: "Customer 3", subOwnerGroup: "Group A", keyAccountGroup: "Yes", grade: "A", storeType: "Retail", email: "customer3@example.com" },
    // More customers
  ];

  // Filter customers who have emails
  const customersWithEmails = customerData.filter(customer => customer.email);

  const storeListContainer = document.getElementById("storeList");
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
  const searchInput = document.getElementById("searchInput");
  const sendEmailButton = document.getElementById("sendEmailButton");

  function displayStores(stores) {
    storeListContainer.innerHTML = ""; // Clear previous results

    stores.forEach(store => {
      const storeDiv = document.createElement("div");
      storeDiv.className = "store-item";
      storeDiv.innerHTML = `
        <label>
          <input type="checkbox" class="selectStoreCheckbox">
          ${store.customerName} | ${store.subOwnerGroup} | ${store.keyAccountGroup} | ${store.grade} | ${store.storeType} | <a href="mailto:${store.email}">${store.email}</a>
        </label>
      `;
      storeListContainer.appendChild(storeDiv);
    });
  }

  // Display all customers initially
  displayStores(customersWithEmails);

  // Search functionality
  searchInput.addEventListener("input", function() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredStores = customersWithEmails.filter(store => {
      return (
        store.customerName.toLowerCase().includes(searchTerm) ||
        store.subOwnerGroup.toLowerCase().includes(searchTerm) ||
        store.keyAccountGroup.toLowerCase().includes(searchTerm) ||
        store.grade.toLowerCase().includes(searchTerm) ||
        store.storeType.toLowerCase().includes(searchTerm)
      );
    });
    displayStores(filteredStores);

    // Enable/Disable Send Email button
    sendEmailButton.disabled = searchTerm.length === 0;
  });

  // Select All Checkbox
  selectAllCheckbox.addEventListener("change", function() {
    const checkboxes = document.querySelectorAll(".selectStoreCheckbox");
    checkboxes.forEach(checkbox => checkbox.checked = selectAllCheckbox.checked);
  });
});
