document.addEventListener('DOMContentLoaded', () => {
  // Dropdown toggling on hover
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const menu = dropdown.querySelector('.dropdown-menu');

    dropdown.addEventListener('mouseover', () => {
      menu.style.display = 'block';
    });

    dropdown.addEventListener('mouseout', () => {
      menu.style.display = 'none';
    });
  });

  // Handle logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
     
    window.location.href = 'index.html'; // Redirect to main login page
  });
});
