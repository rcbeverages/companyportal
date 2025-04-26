// dashboard.js

document.addEventListener("DOMContentLoaded", async function () {
  const username = localStorage.getItem("username");
  const container = document.getElementById("dashboard-sections");

  if (!username) {
    container.innerHTML = "<p style='color: red;'>No username detected. Please log in again.</p>";
    return;
  }

  try {
    const response = await fetch("https://sheetdb.io/api/v1/abgzvmn3160g0"); // Your Users API
    const users = await response.json();

    const user = users.find(u => u.Username === username);

    if (!user) {
      container.innerHTML = "<p style='color: red;'>User not found. Please log in again.</p>";
      return;
    }

    const role = user.Role;

    const allButtons = [
      { name: "Warehouse", page: "warehouse.html", roles: ["Admin", "Warehouse", "Sales"] },
      { name: "Settings", page: "settings.html", roles: ["Admin"] },
      { name: "Resources", page: "resources.html", roles: ["Admin", "Sales"] },
      { name: "Orders & Visits", page: "orders_visits.html", roles: ["Admin", "Sales"] },
      { name: "Marketing & Promotions", page: "marketing_promotions.html", roles: ["Admin", "Marketing"] },
      { name: "Data & Analytics", page: "data_analytics.html", roles: ["Admin"] },
      { name: "CRM Tools", page: "crmtools.html", roles: ["Admin"] }
    ];

    allButtons.forEach(button => {
      if (button.roles.includes(role)) {
        const btn = document.createElement("button");
        btn.className = "dashboard-btn";
        btn.textContent = button.name;
        btn.onclick = () => location.href = button.page;
        container.appendChild(btn);
      }
    });

  } catch (error) {
    console.error("Error fetching user data:", error);
    container.innerHTML = "<p style='color: red;'>Error loading dashboard. Please try again later.</p>";
  }
});
