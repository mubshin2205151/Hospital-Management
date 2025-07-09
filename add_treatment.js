document.addEventListener('DOMContentLoaded', () => {
    const diagnosisSelect = document.getElementById('diagnosis');
  
    fetch('http://localhost:3000/diagnoses') // Optional: GET API to list diagnoses
      .then(res => res.json())
      .then(diagnoses => {
        diagnoses.forEach(diag => {
          const option = document.createElement('option');
          option.value = diag.diagnosis_id;
          option.textContent = `Diagnosis #${diag.diagnosis_id} (Test ${diag.test_id})`;
          diagnosisSelect.appendChild(option);
        });
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