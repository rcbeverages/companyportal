// login.js

document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const usernameInput = document.getElementById("username").value.trim();
  const passwordInput = document.getElementById("password").value.trim();

  const users = await fetchUsers();

  const user = users.find(u => 
    u.Username === usernameInput && u.Password === passwordInput
  );

  if (user) {
    localStorage.setItem("username", user.Username);
    localStorage.setItem("role", user.Role);

    window.location.href = "dashboard.html"; // Redirect to dashboard
  } else {
    document.getElementById("error-message").style.display = "block";
  }
});
