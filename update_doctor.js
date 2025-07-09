console.log("Script loaded");

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("doctorTableBody");
  console.log("DOM loaded. TableBody:", tableBody);

  fetch("http://localhost:3000/all-doctors")
    .then(res => res.json())
    .then(doctors => {
      if (!doctors.length) {
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center">No doctors found</td></tr>`;
        return;
      }

      doctors.forEach(doc => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${doc.id}</td>
          <td>${doc.name}</td>
          <td>${doc.salary}</td>
          <td>
            <button class="btn btn-sm btn-primary update-btn"
                    data-id="${doc.id}"
                    data-name="${doc.name}"
                    data-salary="${doc.salary}">
              Update Salary
            </button>
          </td>
        `;
        tableBody.appendChild(tr);
      });

      document.querySelectorAll(".update-btn").forEach(button => {
        button.addEventListener("click", () => {
          const doctorId = button.dataset.id;
          const doctorName = button.dataset.name;
          const oldSalary = button.dataset.salary;

          const newSalary = prompt(`Enter new salary for ${doctorName} (Current: ${oldSalary})`);
          if (!newSalary || isNaN(newSalary) || newSalary <= 0) {
            alert("Invalid salary entered.");
            return;
          }

          fetch("http://localhost:3000/update-doctor-salary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ doctor_id: doctorId, new_salary: newSalary })
          })
            .then(res => res.json())
            .then(() => {
              alert(`Updated salary for ${doctorName}`);
              location.reload();
            })
            .catch(err => {
              console.error(err);
              alert("Failed to update salary.");
            });
        });
      });
    })
    .catch(err => {
      console.error("Fetch error:", err);
      tableBody.innerHTML = `<tr><td colspan="4" class="text-danger text-center">Error loading data</td></tr>`;
    });
});
