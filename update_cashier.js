console.log("update_cashier.js loaded");

window.onload = async function () {
  const tableBody = document.getElementById("cashierTableBody");

  try {
    const res = await fetch("http://localhost:3000/get-cashiers", { credentials: "include" });
    const cashiers = await res.json();

    cashiers.forEach((cashier) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${cashier.id}</td>
        <td>${cashier.name}</td>
        <td>${cashier.salary}</td>
        <td><input type="number" class="form-control" id="input-${cashier.id}" placeholder="Enter new salary"></td>
        <td><button class="btn btn-primary" onclick="updateCashier(${cashier.id}, '${cashier.name}', ${cashier.salary})">Update</button></td>
      `;

      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading cashiers:", err);
    alert("Failed to load cashiers.");
  }
};

async function updateCashier(id, name, oldSalary) {
  const newSalaryInput = document.getElementById(`input-${id}`);
  const newSalary = newSalaryInput.value.trim();

  if (!newSalary || isNaN(newSalary) || newSalary <= 0) {
    alert("Please enter a valid positive new salary.");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/update-cashier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, name, oldSalary, newSalary: Number(newSalary) }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Cashier salary updated successfully!");
      location.reload();
    } else {
      alert("Update failed.");
    }
  } catch (err) {
    console.error(err);
    alert("Error updating cashier.");
  }
}
