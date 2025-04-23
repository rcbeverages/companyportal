// header.js
document.addEventListener("DOMContentLoaded", function () {
  fetch('header.html')  // Path to header.html (adjust if necessary)
    .then(response => response.text())  // Fetch the header HTML
    .then(data => {
      document.querySelector("body").insertAdjacentHTML("afterbegin", data);  // Inject the header at the top of the body
    })
    .catch(err => console.error('Error loading header:', err));  // Handle errors
});
