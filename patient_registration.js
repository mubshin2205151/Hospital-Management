// document.addEventListener('DOMContentLoaded', () => {
//   const form = document.getElementById("patientForm");
//   const typeSelect = document.getElementById("patient_type");
//   const residentSection = document.getElementById("residentSection");

//   typeSelect.addEventListener("change", () => {
//     residentSection.style.display = typeSelect.value === "resident" ? "block" : "none";
//   });

//   form.addEventListener("submit", async function (e) {
//     e.preventDefault();

//     const id = parseInt(document.getElementById("id").value);
//     const person = {
//       id,
//       name: document.getElementById("name").value,
//       phone_no: document.getElementById("phone").value,
//       age: parseInt(document.getElementById("age").value),
//       blood_group: document.getElementById("blood").value,
//       person_type: "patient"
//     };

//     const patient_type = document.getElementById("patient_type").value;

//     try {
//       // Insert into person
//       const personRes = await fetch("http://localhost:3000/person", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(person)
//       });
//       if (!personRes.ok) throw new Error("Person insert failed");

//       // Insert into patient
//       const patientRes = await fetch("http://localhost:3000/patient", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ patient_id: id, patient_type })
//       });
//       if (!patientRes.ok) throw new Error("Patient insert failed");

//       // Optional: insert into resident_patient
//       if (patient_type === "resident") {
//         const resident = {
//           patient_id: id,
//           unit_no: parseInt(document.getElementById("unit_no").value),
//           residence_type: document.getElementById("residence_type").value,
//           department_id: parseInt(document.getElementById("department_id").value),
//           day_count: parseInt(document.getElementById("day_count").value),
//           residence_cost: parseFloat(document.getElementById("residence_cost").value)
//         };

//         const resRes = await fetch("http://localhost:3000/resident_patient", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(resident)
//         });
//         if (!resRes.ok) throw new Error("Resident patient insert failed");
//       }

//       alert("Patient registered successfully!");
//       form.reset();
//       residentSection.style.display = "none";

//     } catch (err) {
//       alert("Registration failed: " + err.message);
//       console.error(err);
//     }
//   });
// });


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("patientForm");
  const typeSelect = document.getElementById("patient_type");
  const residentSection = document.getElementById("residentSection");

  typeSelect.addEventListener("change", () => {
    residentSection.style.display = typeSelect.value === "resident" ? "block" : "none";
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const age = parseInt(document.getElementById("age").value);
    const blood_group = document.getElementById("blood").value;
    const patient_type = document.getElementById("patient_type").value;

    try {
      // Fetch next available patient ID
      const idRes = await fetch("http://localhost:3000/next_patient_id");
      const { new_id } = await idRes.json();

      const person = {
        id: new_id,
        name,
        phone_no: phone,
        age,
        blood_group,
        person_type: "patient"
      };

      // Insert into person
      const personRes = await fetch("http://localhost:3000/person", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(person)
      });
      if (!personRes.ok) throw new Error("Person insert failed");

      // Insert into patient
      const patientRes = await fetch("http://localhost:3000/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: new_id, patient_type })
      });
      if (!patientRes.ok) throw new Error("Patient insert failed");

      // Optional: insert into resident_patient
      if (patient_type === "resident") {
        const resident = {
          patient_id: new_id,
          unit_no: parseInt(document.getElementById("unit_no").value),
          residence_type: document.getElementById("residence_type").value,
          department_id: parseInt(document.getElementById("department_id").value),
          day_count: parseInt(document.getElementById("day_count").value),
          residence_cost: parseFloat(document.getElementById("residence_cost").value)
        };

        const resRes = await fetch("http://localhost:3000/resident_patient", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resident)
        });
        if (!resRes.ok) throw new Error("Resident patient insert failed");
      }

      alert("Patient registered successfully!");
      window.location.href = "patient_login.html"; // Auto-redirect after success
    } catch (err) {
      alert("Registration failed: " + err.message);
      console.error(err);
    }
  });

  // Highlight nav
  document.querySelectorAll("nav a").forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add("active");
    }
  });
});
