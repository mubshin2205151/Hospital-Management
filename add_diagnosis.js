document.addEventListener('DOMContentLoaded', () => {
    const testSelect = document.getElementById('test');
  
    fetch('http://localhost:3000/tests') // You'll need to add this GET API if not present
      .then(res => res.json())
      .then(tests => {
        tests.forEach(test => {
          const option = document.createElement('option');
          option.value = test.test_id;
          option.textContent = `${test.test_name} (ID: ${test.test_id})`;
          testSelect.appendChild(option);
        });
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