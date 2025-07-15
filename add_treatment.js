// document.addEventListener('DOMContentLoaded', () => {
//     const diagnosisSelect = document.getElementById('diagnosis');
  
//     fetch('http://localhost:3000/diagnoses') // Optional: GET API to list diagnoses
//       .then(res => res.json())
//       .then(diagnoses => {
//         diagnoses.forEach(diag => {
//           const option = document.createElement('option');
//           option.value = diag.diagnosis_id;
//           option.textContent = `Diagnosis #${diag.diagnosis_id} (Test ${diag.test_id})`;
//           diagnosisSelect.appendChild(option);
//         });
//       });
  
//     document.getElementById('treatmentForm').addEventListener('submit', e => {
//       e.preventDefault();
  
//       const treatment = {
//         diagnosis_id: parseInt(diagnosisSelect.value),
//         treatment_type: document.getElementById('type').value,
//         treatment_cost: parseFloat(document.getElementById('cost').value)
//       };
  
//       fetch('http://localhost:3000/treatment', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(treatment)
//       })
//         .then(res => {
//           if (!res.ok) throw new Error("Failed");
//           alert("Treatment added!");
//           document.getElementById('treatmentForm').reset();
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
    alert("Please login as a doctor first.");
    window.location.href = "doctor_login.html";
    return;
  }

  const diagnosisSelect = document.getElementById('diagnosis');

  fetch(`http://localhost:3000/diagnoses?doctor_email=${encodeURIComponent(doctor.email)}`)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch diagnoses");
      return res.json();
    })
    .then(diagnoses => {
      if (diagnoses.length === 0) {
        diagnosisSelect.innerHTML = `<option disabled>No diagnoses found</option>`;
        return;
      }

      diagnoses.forEach(diag => {
        const option = document.createElement('option');
        option.value = diag.diagnosis_id;
        option.textContent = `Diagnosis #${diag.diagnosis_id} (Test ID: ${diag.test_id})`;
        diagnosisSelect.appendChild(option);
      });
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Failed to load diagnoses");
    });

  document.getElementById('treatmentForm').addEventListener('submit', e => {
    e.preventDefault();

    const treatment = {
      diagnosis_id: parseInt(diagnosisSelect.value),
      treatment_type: document.getElementById('type').value,
      treatment_cost: parseFloat(document.getElementById('cost').value)
    };

    fetch('http://localhost:3000/treatment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(treatment)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed");
        alert("Treatment added!");
        document.getElementById('treatmentForm').reset();
      })
      .catch(err => alert("Error: " + err.message));
  });
});

document.querySelectorAll("nav a").forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});
