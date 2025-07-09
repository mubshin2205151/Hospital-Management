document.getElementById("doctorForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = parseInt(document.getElementById("id").value); // added
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const age = parseInt(document.getElementById("age").value);
  const blood = document.getElementById("blood").value;
  const department = parseInt(document.getElementById("department").value);
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Step 1: Insert into person
    const personRes = await fetch("http://localhost:3000/person", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name,
        phone_no: phone,
        age,
        blood_group: blood,
        person_type: "employee"
      })
    });

    if (!personRes.ok) throw new Error("Failed to insert person");

    // Step 2: Insert into employee
    const employeeRes = await fetch("http://localhost:3000/employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_id: id,
        salary: 0, // You can collect this from the form later
        employee_type: "doctor"
      })
    });

    if (!employeeRes.ok) throw new Error("Failed to insert employee");

    // Step 3: Insert into doctor
    const doctorRes = await fetch("http://localhost:3000/doctor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctor_id: id,
        department_id: department,
        email,
        password
      })
    });

    if (!doctorRes.ok) throw new Error("Failed to insert doctor");

    alert("Doctor registered successfully!");
    document.getElementById("doctorForm").reset();

  } catch (err) {
    console.error("Error:", err);
    alert("Doctor registration failed: " + err.message);
  }
});


document.querySelectorAll("nav a").forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});