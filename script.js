document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch("http://localhost:3000/admin-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include", 
    body: JSON.stringify({ email, password })
  })
    .then(res => {
      if (!res.ok) throw new Error("Invalid credentials");
      return res.json();
    })
    .then(data => {
      // Optionally store name or show a welcome message
      window.location.href = "admin_dashboard.html";
    })
    .catch(err => {
      alert("Login failed: " + err.message);
    });
});

document.querySelectorAll("nav a").forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});
