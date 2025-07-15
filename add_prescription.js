// document.addEventListener("DOMContentLoaded", () => {
//   const appointmentSelect = document.getElementById("appointment");
//   const testList = document.getElementById("testList");
//   let appointments = [];

//   // Fetch appointments
//   fetch("http://localhost:3000/appointments")
//     .then((res) => res.json())
//     .then((data) => {
//       appointments = data;
//       appointments.forEach((app) => {
//         const option = document.createElement("option");
//         option.value = app.appointment_id;
//         option.textContent = `Appointment #${app.appointment_id} (Patient: ${app.patient_name}, Doctor: ${app.doctor_name})`;


//         appointmentSelect.appendChild(option);
//       });
//     });

//   // Add test input row
//   document.getElementById("addTest").addEventListener("click", () => {
//     const div = document.createElement("div");
//     div.innerHTML = `
//       <input type="text" placeholder="Test Name" class="test-name" required>
//       <input type="number" placeholder="Test Cost" class="test-cost" required>
//       <input type="date" class="test-date" required>
//     `;
//     testList.appendChild(div);
//   });

//   // Handle form submission
//   document
//     .getElementById("prescriptionForm")
//     .addEventListener("submit", (e) => {
//       e.preventDefault();

//       const prescription = {
//         prescription_id: parseInt(document.getElementById("prescription_id").value),  
//         appointment_id: parseInt(appointmentSelect.value),
//         prescription_date: document.getElementById("prescription_date").value,
//         tests: [],
//       };
//       document.querySelectorAll("#testList > div").forEach((div) => {
//         const name = div.querySelector(".test-name").value;
//         const cost = parseFloat(div.querySelector(".test-cost").value);
//         const date = div.querySelector(".test-date").value;

//         prescription.tests.push({
//           test_name: name,
//           test_cost: cost,
//           test_date: date,
//         });
//       });

//       fetch("http://localhost:3000/prescriptions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(prescription),
//       })
//         .then((res) => {
//           if (!res.ok) throw new Error("Error saving prescription");
//           alert("Prescription saved successfully");
//           document.getElementById("prescriptionForm").reset();
//           testList.innerHTML = "";
//         })
//         .catch((err) => {
//           console.error(err);
//           alert("Failed to save prescription");
//         });
//     });
// });


// document.querySelectorAll("nav a").forEach(link => {
//   if (link.href === window.location.href) {
//     link.classList.add("active");
//   }
// });


document.addEventListener("DOMContentLoaded", () => {
  const doctor = JSON.parse(sessionStorage.getItem("loggedInDoctor"));
  if (!doctor) {
    alert("You must log in as a doctor first.");
    window.location.href = "doctor_login.html";
    return;
  }

  const appointmentSelect = document.getElementById("appointment");
  const testList = document.getElementById("testList");

  // Fetch appointments for the logged-in doctor
  fetch(`http://localhost:3000/doctor-appointments?email=${encodeURIComponent(doctor.email)}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return res.json();
    })
    .then((appointments) => {
      if (appointments.length === 0) {
        appointmentSelect.innerHTML = '<option disabled>No appointments found</option>';
        return;
      }

      appointments.forEach((app) => {
        const option = document.createElement("option");
        option.value = app.appointment_id;
        option.textContent = `Appointment #${app.appointment_id} (Patient: ${app.patient_name})`;
        appointmentSelect.appendChild(option);
      });
    })
    .catch((err) => {
      console.error("Error fetching doctor appointments:", err);
      alert("Error loading appointments");
    });

  // Add test input row
  document.getElementById("addTest").addEventListener("click", () => {
    const div = document.createElement("div");
    div.innerHTML = `
      <input type="text" placeholder="Test Name" class="test-name" required>
      <input type="number" placeholder="Test Cost" class="test-cost" required>
      <input type="date" class="test-date" required>
    `;
    testList.appendChild(div);
  });

  // Submit prescription form
  document.getElementById("prescriptionForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const prescription = {
      prescription_id: parseInt(document.getElementById("prescription_id").value),
      appointment_id: parseInt(appointmentSelect.value),
      prescription_date: document.getElementById("prescription_date").value,
      tests: [],
    };

    document.querySelectorAll("#testList > div").forEach((div) => {
      const name = div.querySelector(".test-name").value;
      const cost = parseFloat(div.querySelector(".test-cost").value);
      const date = div.querySelector(".test-date").value;

      prescription.tests.push({ test_name: name, test_cost: cost, test_date: date });
    });

    fetch("http://localhost:3000/prescriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prescription),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error saving prescription");
        alert("Prescription saved successfully");
        document.getElementById("prescriptionForm").reset();
        testList.innerHTML = "";
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to save prescription");
      });
  });
});

// Highlight active nav
document.querySelectorAll("nav a").forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});

