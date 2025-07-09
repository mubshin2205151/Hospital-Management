document.getElementById('doctorForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    age: document.getElementById('age').value,
    blood_group: document.getElementById('blood_group').value,
    department_id: document.getElementById('department_id').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  fetch("http://localhost:3000/insert-doctor", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    credentials: "include",  // <-- required for session-based login
    body: JSON.stringify(data)
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to insert doctor");
    return res.json();
  })
  .then(response => {
    alert("Doctor inserted successfully!");
    document.getElementById('doctorForm').reset();
  })
  .catch(err => {
    console.error(err);
    alert("Failed to insert doctor.");
  });
});
