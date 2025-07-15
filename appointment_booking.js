document.addEventListener('DOMContentLoaded', () => {
  const doctorSelect = document.getElementById('doctor');
  const patientField = document.getElementById('patient_id');
  const appointmentIdField = document.getElementById('appointment_id');

  const patient = JSON.parse(sessionStorage.getItem("loggedInPatient"));
  if (!patient) {
    alert("You must login as a patient to book an appointment.");
    window.location.href = "patient_login.html";
    return;
  }

  // Set patient ID from session
  patientField.value = patient.id;

  // Get next appointment ID from backend
  fetch('http://localhost:3000/appointments/next-id')
    .then(res => res.json())
    .then(data => {
      appointmentIdField.value = data.next_id;
    })
    .catch(err => {
      console.error("Error getting next appointment ID:", err);
      alert("Failed to initialize appointment form.");
    });

  // Load doctors
  fetch("http://localhost:3000/doctors")
    .then(res => res.json())
    .then(doctors => {
      doctors.forEach(doctor => {
        const option = document.createElement("option");
        option.value = doctor.doctor_id;
        option.textContent = `Dr. ${doctor.name} (Dept ${doctor.department_id})`;
        doctorSelect.appendChild(option);
      });
    });

  // Submit form
  document.getElementById('appointmentForm').addEventListener('submit', e => {
    e.preventDefault();

    const appointment = {
      appointment_id: parseInt(appointmentIdField.value),
      patient_id: parseInt(patientField.value),
      doctor_id: parseInt(doctorSelect.value),
      appointment_date: document.getElementById('date').value,
      appointment_charge: parseFloat(document.getElementById("appointment_charge").value)
    };

    fetch("http://localhost:3000/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointment)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed");
        alert("Appointment booked successfully!");
        document.getElementById("appointmentForm").reset();

        // regenerate next ID
        return fetch('http://localhost:3000/appointments/next-id');
      })
      .then(res => res.json())
      .then(data => {
        appointmentIdField.value = data.next_id;
      })
      .catch(err => {
        console.error("Error booking appointment:", err);
        alert("Error booking appointment.");
      });
  });
});

// Highlight current nav
document.querySelectorAll("nav a").forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});
