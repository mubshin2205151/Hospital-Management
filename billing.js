
// billing.js
document.addEventListener('DOMContentLoaded', () => {
  const patientSelect = document.getElementById('patient');

  // ✅ Autofill cashier ID from sessionStorage
  const cashierId = sessionStorage.getItem('cashierId');
  if (!cashierId) {
    alert('You must be logged in as a cashier');
    window.location.href = 'cashier_login.html';
    return;
  }
  document.getElementById('cashier_id').value = cashierId;

  fetch('http://localhost:3000/patients')
    .then(res => res.json())
    .then(patients => {
      patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = `${patient.name} (ID: ${patient.id})`;
        patientSelect.appendChild(option);
      });
    });

  document.getElementById('billingForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const bill = {
      patient_id: parseInt(patientSelect.value),
      cashier_id: parseInt(document.getElementById('cashier_id').value),
      appointment_charge: parseFloat(document.getElementById('appointment_charge').value),
      residence_charge: parseFloat(document.getElementById('residence').value),
      medicine_charge: parseFloat(document.getElementById('medicine').value),
      treatment_charge: parseFloat(document.getElementById('treatment').value),
      test_charge: parseFloat(document.getElementById('test').value),
    };

    bill.total_charge = (
      bill.appointment_charge +
      bill.residence_charge +
      bill.medicine_charge +
      bill.treatment_charge +
      bill.test_charge
    ).toFixed(2);

    fetch('http://localhost:3000/bills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bill)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to generate bill');
        return res.json();
      })
      .then(data => {
        document.getElementById('billOutput').innerHTML = `
          <h3>Bill Summary</h3>
          <p><strong>Bill ID:</strong> ${data.bill_id}</p>
          <p><strong>Patient ID:</strong> ${data.patient_id}</p>
          <p><strong>Appointment:</strong> ₹${data.appointment_charge}</p>
          <p><strong>Residence:</strong> ₹${data.residence_charge}</p>
          <p><strong>Medicine:</strong> ₹${data.medicine_charge}</p>
          <p><strong>Treatment:</strong> ₹${data.treatment_charge}</p>
          <p><strong>Test:</strong> ₹${data.test_charge}</p>
          <p><strong>Total:</strong> ₹${data.total_charge}</p>
        `;
        document.getElementById("billingForm").reset();
      })
      .catch(err => {
        console.error(err);
        alert('Error generating bill');
      });
  });
});
