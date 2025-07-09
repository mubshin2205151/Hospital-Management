document.addEventListener("DOMContentLoaded", () => {
    const patientSelect = document.getElementById("patient");
    const billSelect = document.getElementById("bill");
  
    // Fetch patients
    fetch("http://localhost:3000/patients")
      .then(res => res.json())
      .then(patients => {
        patients.forEach(patient => {
          const option = document.createElement("option");
          option.value = patient.id;
          option.textContent = `${patient.name} (ID: ${patient.id})`;
          patientSelect.appendChild(option);
        });
      });
  
    // Fetch bills
    fetch("http://localhost:3000/bills")
      .then(res => res.json())
      .then(bills => {
        bills.forEach(bill => {
          const option = document.createElement("option");
          option.value = bill.bill_id;
          option.textContent = `Bill #${bill.bill_id} - ₹${bill.total_charge}`;
          billSelect.appendChild(option);
        });
      });
  
    // Handle form submission
    document.getElementById("recordForm").addEventListener("submit", (e) => {
      e.preventDefault();
  
      const record = {
        patient_id: parseInt(patientSelect.value),
        bill_id: parseInt(billSelect.value),
        cashier_id: parseInt(document.getElementById("cashier_id").value),
        disease: document.getElementById("disease").value,
        admission_date: document.getElementById("admission_date").value,
        discharge_date: document.getElementById("discharge_date").value,
      };
  
      fetch("http://localhost:3000/hospital_record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to add hospital record");
          return res.json();
        })
        .then(data => {
          document.getElementById("statusMsg").textContent = "Hospital record added successfully!";
          document.getElementById("recordForm").reset();
        })
        .catch((err) => {
          console.error(err);
          document.getElementById("statusMsg").textContent = "Error: " + err.message;
        });
    });
  });
  

  document.querySelectorAll("nav a").forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});