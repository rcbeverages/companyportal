// login.js

// Clear any previous session
localStorage.clear();


document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const usernameInput = document.getElementById("username").value.trim();
  const passwordInput = document.getElementById("password").value.trim();

  const users = await fetchUsers(); // <-- pulls from live SheetDB

  const user = users.find(u => 
    u.Username === usernameInput && u.Password === passwordInput
  );

  if (user) {
    // Set the username and role in localStorage
    localStorage.setItem("username", user.Username);
    localStorage.setItem("role", user.Role);

    // Set the bdmName in localStorage, assuming the bdmName is the Username or comes from another property
    localStorage.setItem("bdmName", user.Username); // Adjust this line if you want to set a different property (like `user.BDM_Name`)

    // Redirect to dashboard
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("error-message").style.display = "block";  // Show error message if login fails
  }
});
