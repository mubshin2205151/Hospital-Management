// doctor_login.js

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:3000/doctors')
    .then(response => response.json())  
    .then(doctors => {
      const matchedDoctor = doctors.find(doctor =>
        doctor.email === email && doctor.password === password
      );

      if (matchedDoctor) {
        alert(`Welcome, Dr. ${matchedDoctor.name}!`);
        sessionStorage.setItem('loggedInDoctor', JSON.stringify(matchedDoctor));
        // Optional: redirect to another page here, like:
        // window.location.href = 'appointments.html';
      } else {
        alert('Invalid email or password');
      }
    })
    .catch(error => {
      console.error('Error fetching doctors:', error);
      alert('Error loading doctors');
    });
});


document.querySelectorAll("nav a").forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});