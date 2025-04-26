document.addEventListener("DOMContentLoaded", function () {
  const role = localStorage.getItem("role");
  const container = document.getElementById("dashboard-sections");

  if (!role) {
    container.innerHTML = "<p style='color: red;'>No role detected. Please log in again.</p>";
    return;
  }

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
});
