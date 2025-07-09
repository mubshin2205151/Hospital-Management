// Fetch all nurses
fetch("http://localhost:3000/get-all-nurses", { credentials: "include" })
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("nurseList");
    if (data.length === 0) {
      container.innerHTML = "<p>No nurses found.</p>";
      return;
    }

    data.forEach(nurse => {
      const div = document.createElement("div");
      div.className = "card mb-3 p-3";

      div.innerHTML = `
        <h5>${nurse.name} (ID: ${nurse.id})</h5>
        <button class="btn btn-info btn-sm mr-2 details-btn">Details</button>
        <button class="btn btn-danger btn-sm delete-btn">Remove</button>
        <div class="details mt-2" style="display: none;"></div>
      `;

      // Show Details
      div.querySelector(".details-btn").onclick = () => {
        const detailsDiv = div.querySelector(".details");
        if (detailsDiv.style.display === "none") {
          detailsDiv.style.display = "block";
          detailsDiv.innerHTML = `
            <strong>Age:</strong> ${nurse.age}<br>
            <strong>Phone:</strong> ${nurse.phone_no}<br>
            <strong>Blood Group:</strong> ${nurse.blood_group}<br>
            <strong>Department ID:</strong> ${nurse.department_id}<br>
            <strong>Shift Length:</strong> ${nurse.work_hour} hrs
          `;
        } else {
          detailsDiv.style.display = "none";
        }
      };

      // Delete Nurse
      div.querySelector(".delete-btn").onclick = () => {
        if (confirm(`Are you sure you want to delete ${nurse.name}?`)) {
          fetch(`http://localhost:3000/delete-nurse/${nurse.id}`, {
            method: "DELETE",
            credentials: "include"
          })
            .then(res => {
              if (!res.ok) throw new Error("Deletion failed");
              alert("Nurse deleted successfully");
              div.remove();
            })
            .catch(err => {
              console.error(err);
              alert("Failed to delete nurse.");
            });
        }
      };

      container.appendChild(div);
    });
  })
  .catch(err => {
    console.error("Error fetching nurses:", err);
    alert("Could not load nurses.");
  });
