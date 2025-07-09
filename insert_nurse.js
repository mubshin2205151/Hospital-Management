// document.getElementById('nurseForm').addEventListener('submit', function(e) {
//   e.preventDefault();

//   const data = {
//     name: document.getElementById('name').value,
//     phone: document.getElementById('phone').value,
//     age: document.getElementById('age').value,
//     blood_group: document.getElementById('blood_group').value,
//     department_id: document.getElementById('department_id').value,
//     shift_length: document.getElementById('shift_length').value
//   };

//   fetch("http://localhost:3000/insert-nurse", {
//     method: "POST",
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data)
//   })
//   .then(res => res.json())
//   .then(response => {
//     alert("Nurse inserted successfully!");
//     document.getElementById('nurseForm').reset();
//   })
//   .catch(err => {
//     console.error(err);
//     alert("Failed to insert nurse.");
//   });
// });

document.getElementById('nurseForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    age: document.getElementById('age').value,
    blood_group: document.getElementById('blood_group').value,
    department_id: document.getElementById('department_id').value,
    shift_length: document.getElementById('shift_length').value
  };

  fetch("http://localhost:3000/insert-nurse", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    credentials: "include",
    body: JSON.stringify(data)
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to insert nurse");
    return res.json();
  })
  .then(response => {
    alert("Nurse inserted successfully!");
    document.getElementById('nurseForm').reset();
  })
  .catch(err => {
    console.error(err);
    alert("Failed to insert nurse.");
  });
});
