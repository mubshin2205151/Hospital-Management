document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/get-doctors')
    .then(res => res.json())
    .then(doctors => {
      const listDiv = document.getElementById('doctorList');
      listDiv.innerHTML = '';

      doctors.forEach(doc => {
        const div = document.createElement('div');
        div.classList.add('card', 'p-3', 'mb-3');

        div.innerHTML = `
          <h5>${doc.name}</h5>
          <button class="btn btn-info mr-2" data-id="${doc.id}" onclick="viewDetails(${doc.id})">Details</button>
          <button class="btn btn-danger" data-id="${doc.id}" onclick="removeDoctor(${doc.id}, '${doc.name}')">Remove</button>
          <div id="details-${doc.id}" class="mt-2" style="display: none;"></div>
        `;
        listDiv.appendChild(div);
      });
    });
});

function viewDetails(id) {
  const detailsDiv = document.getElementById(`details-${id}`);
  if (detailsDiv.style.display === 'block') {
    detailsDiv.style.display = 'none';
    return;
  }

  fetch(`http://localhost:3000/get-doctor-details/${id}`)
    .then(res => res.json())
    .then(doc => {
      detailsDiv.innerHTML = `
        <p><strong>Email:</strong> ${doc.email}</p>
        <p><strong>Age:</strong> ${doc.age}</p>
        <p><strong>Phone:</strong> ${doc.phone_no}</p>
        <p><strong>Blood Group:</strong> ${doc.blood_group}</p>
        <p><strong>Department ID:</strong> ${doc.department_id}</p>
      `;
      detailsDiv.style.display = 'block';
    });
}

function removeDoctor(id, name) {
  if (!confirm(`Are you sure you want to remove Dr. ${name}?`)) return;

  fetch(`http://localhost:3000/delete-doctor/${id}`, {
    method: "DELETE",
    credentials: "include"
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed");
      alert("Doctor removed successfully");
      location.reload();
    })
    .catch(err => {
      console.error(err);
      alert("Failed to remove doctor.");
    });
}
