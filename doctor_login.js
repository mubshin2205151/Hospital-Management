// doctor_login.js

// document.getElementById('loginForm').addEventListener('submit', function (e) {
//   e.preventDefault();

//   const email = document.getElementById('email').value;
//   const password = document.getElementById('password').value;

//   fetch('http://localhost:3000/doctors') // Adjust endpoint if needed
//     .then(response => response.json())
//     .then(doctors => {
//       const matchedDoctor = doctors.find(doctor =>
//         doctor.email === email && doctor.password === password
//       );

//       if (matchedDoctor) {
//         alert(`Welcome, Dr. ${matchedDoctor.name}!`);

//         // Save essential doctor info in sessionStorage
//         sessionStorage.setItem('doctor_id', matchedDoctor.id);
//         sessionStorage.setItem('doctor_name', matchedDoctor.name);

//         // Redirect to doctor dashboard
//         window.location.href = 'doctor_dashboard.html';
//       } else {
//         alert('Invalid email or password');
//       }
//     })
//     .catch(error => {
//       console.error('Error fetching doctors:', error);
//       alert('Error loading doctors');
//     });
// });

// // Highlight active nav link
// document.querySelectorAll("nav a").forEach(link => {
//   if (link.href === window.location.href) {
//     link.classList.add("active");
//   }
// });


// doctor_login.js (with full doctor object stored)

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

        // ✅ Store full object under consistent key
        sessionStorage.setItem('loggedInDoctor', JSON.stringify(matchedDoctor));

        // ✅ Redirect to doctor dashboard
        window.location.href = 'doctor_dashboard.html';
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
