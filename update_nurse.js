console.log("update_nurse.js loaded");

window.onload = async function () {
  const tableBody = document.getElementById("nurseTableBody");

  try {
    const res = await fetch("http://localhost:3000/get-nurses");
    const nurses = await res.json();

    nurses.forEach((nurse) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${nurse.id}</td>
        <td>${nurse.name}</td>
        <td>${nurse.salary}</td>
        <td><input type="number" class="form-control" id="input-${nurse.id}" placeholder="Enter new salary"></td>
        <td><button class="btn btn-primary" onclick="updateNurse(${nurse.id}, '${nurse.name}', ${nurse.salary})">Update</button></td>
      `;

      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading nurses:", err);
    alert("Failed to load nurses.");
  }
};

async function updateNurse(id, name, oldSalary) {
  const newSalaryInput = document.getElementById(`input-${id}`);
  const newSalary = newSalaryInput.value.trim();

  if (!newSalary || isNaN(newSalary) || newSalary <= 0) {
    alert("Please enter a valid positive new salary.");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/update-nurse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, name, oldSalary, newSalary: Number(newSalary) }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Nurse salary updated successfully!");
      location.reload();
    } else {
      alert("Update failed.");
    }
  } catch (err) {
    console.error(err);
    alert("Error updating nurse.");
  }
}
