document.addEventListener('DOMContentLoaded', () => {
  const patientSelect = document.getElementById('patient');
  const doctorSelect = document.getElementById('doctor');

  let patients = [];
  let doctors = [];

  // Fetch patients
  fetch("http://localhost:3000/patients")
    .then(response => response.json())
    .then(data => {
      patients = data;
      patients.forEach((patient, index) => {
        const option = document.createElement('option');
        option.value = patient.id; 
        option.textContent = patient.name;
        patientSelect.appendChild(option);
      });
    });

  // Fetch doctors
  fetch("http://localhost:3000/doctors")
  .then(response => response.json())
  .then(data => {
    doctors = data;
    doctors.forEach((doctor, index) => {
      console.log("Doctors:", doctors);
      const option = document.createElement('option');
      option.value = doctor.doctor_id; // fixed
      option.textContent = ` ${doctor.name} (Dept ${doctor.department_id})`;
      doctorSelect.appendChild(option);
    });
  });

  
  document.getElementById('appointmentForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const appointment = {
      appointment_id: parseInt(document.getElementById("appointment_id").value),
      patient_id: parseInt(patientSelect.value),
      doctor_id: parseInt(doctorSelect.value),
      appointment_date: document.getElementById('date').value,
      appointment_charge: parseFloat(document.getElementById("appointment_charge").value)
    };

    fetch("http://localhost:3000/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(appointment)
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to book appointment");
        return response.json();
      })
      .then(data => {
        alert("Appointment booked successfully!");
        document.getElementById("appointmentForm").reset();
      })
      .catch(error => {
        console.error("Error booking appointment:", error);
        alert("Failed to book appointment.");
      });
  });
});


document.querySelectorAll("nav a").forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});