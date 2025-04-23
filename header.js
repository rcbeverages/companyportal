// Inject dynamic header text based on the page
document.addEventListener("DOMContentLoaded", function() {
    const pageTitle = document.title; // Get the title of the page
    document.getElementById("page-title").textContent = pageTitle; // Set it to the header
});
