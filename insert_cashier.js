document.getElementById('cashierForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const data = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    age: document.getElementById('age').value,
    blood_group: document.getElementById('blood_group').value,
    department_id: document.getElementById('booth_no').value // booth_no renamed
  };


  fetch("http://localhost:3000/insert-cashier", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    credentials: "include",  // <-- required for session-based login
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(response => {
      alert("Cashier inserted successfully!");
      document.getElementById('cashierForm').reset();
    })
    .catch(err => {
      console.error(err);
      alert("Failed to insert cashier.");
    });
});
