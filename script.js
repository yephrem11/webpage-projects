const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggle-btn");

toggleBtn.addEventListener("click", function() {
    sidebar.classList.toggle("open");
});
