// Fetch all cashiers
fetch("http://localhost:3000/get-all-cashiers", { credentials: "include" })
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("cashierList");
        if (data.length === 0) {
            container.innerHTML = "<p>No cashiers found.</p>";
            return;
        }

        data.forEach(cashier => {
            const div = document.createElement("div");
            div.className = "card mb-3 p-3";

            div.innerHTML = `
        <h5>${cashier.name} (ID: ${cashier.id})</h5>
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
            <strong>Age:</strong> ${cashier.age}<br>
            <strong>Phone:</strong> ${cashier.phone_no}<br>
            <strong>Blood Group:</strong> ${cashier.blood_group}<br>
            <strong>Booth No:</strong> ${cashier.booth_no}
          `;
                } else {
                    detailsDiv.style.display = "none";
                }
            };

            // Delete Cashier
            div.querySelector(".delete-btn").onclick = () => {
                if (confirm(`Are you sure you want to delete ${cashier.name}?`)) {
                    fetch(`http://localhost:3000/delete-cashier/${cashier.id}`, {
                        method: "DELETE",
                        credentials: "include"
                    })
                        .then(res => {
                            if (!res.ok) throw new Error("Deletion failed");
                            alert("Cashier deleted successfully");
                            div.remove();
                        })
                        .catch(err => {
                            console.error(err);
                            alert("Failed to delete cashier.");
                        });
                }
            };

            container.appendChild(div);
        });
    })
    .catch(err => {
        console.error("Error fetching cashiers:", err);
        alert("Could not load cashiers.");
    });
