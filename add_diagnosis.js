// document.addEventListener('DOMContentLoaded', () => {
//     const testSelect = document.getElementById('test');
  
//     fetch('http://localhost:3000/tests') // You'll need to add this GET API if not present
//       .then(res => res.json())
//       .then(tests => {
//         tests.forEach(test => {
//           const option = document.createElement('option');
//           option.value = test.test_id;
//           option.textContent = `${test.test_name} (ID: ${test.test_id})`;
//           testSelect.appendChild(option);
//         });
//       });
  
//     document.getElementById('diagnosisForm').addEventListener('submit', e => {
//       e.preventDefault();
  
//       const diagnosis = {
//         test_id: parseInt(testSelect.value),
//         result: document.getElementById('result').value
//       };
  
//       fetch('http://localhost:3000/diagnosis', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(diagnosis)
//       })
//         .then(res => {
//           if (!res.ok) throw new Error("Failed");
//           alert("Diagnosis added!");
//           document.getElementById('diagnosisForm').reset();
//         })
//         .catch(err => alert("Error: " + err.message));
//     });
//   });
  

//   document.querySelectorAll("nav a").forEach(link => {
//   if (link.href === window.location.href) {
//     link.classList.add("active");
//   }
// });


document.addEventListener('DOMContentLoaded', () => {
  const doctor = JSON.parse(sessionStorage.getItem("loggedInDoctor"));
  if (!doctor) {
    alert("Please log in as a doctor first.");
    window.location.href = "doctor_login.html";
    return;
  }

  const testSelect = document.getElementById('test');

  fetch(`http://localhost:3000/tests?doctor_email=${encodeURIComponent(doctor.email)}`)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch tests");
      return res.json();
    })
    .then(tests => {
      if (tests.length === 0) {
        testSelect.innerHTML = `<option disabled>No tests found</option>`;
        return;
      }

      tests.forEach(test => {
        const option = document.createElement('option');
        option.value = test.test_id;
        option.textContent = `${test.test_name} (ID: ${test.test_id})`;
        testSelect.appendChild(option);
      });
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Failed to load tests");
    });

  document.getElementById('diagnosisForm').addEventListener('submit', e => {
    e.preventDefault();

    const diagnosis = {
      test_id: parseInt(testSelect.value),
      result: document.getElementById('result').value
    };

    fetch('http://localhost:3000/diagnosis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diagnosis)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed");
        alert("Diagnosis added!");
        document.getElementById('diagnosisForm').reset();
      })
      .catch(err => alert("Error: " + err.message));
  });
});

document.querySelectorAll("nav a").forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});
