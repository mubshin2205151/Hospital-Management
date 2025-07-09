// Load all patients on page load
document.addEventListener('DOMContentLoaded', function () {
  loadAllPatients();

  // Highlight active nav link
  document.querySelectorAll("nav a").forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add("active");
    }
  });

  // Attach search handler
  document.getElementById('searchButton').addEventListener('click', searchPatients);
  document.getElementById('resetButton').addEventListener('click', loadAllPatients);
});

function loadAllPatients() {
  fetch('http://localhost:3000/patients')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }
      return response.json();
    })
    .then(data => displayPatients(data))
    .catch(error => {
      console.error('Error loading patients:', error);
      alert('Error Loading Patients');
    });
}

function searchPatients() {
  const type = document.getElementById('searchType').value;
  const value = document.getElementById('searchInput').value.trim();

  if (!value) {
    alert('Please enter a value to search');
    return;
  }

  fetch(`http://localhost:3000/patients/search?type=${type}&value=${encodeURIComponent(value)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Search failed');
      }
      return response.json();
    })
    .then(data => {
      displayPatients(data); // empty array will still show "No patients found"
    })
    .catch(error => {
      console.error('Error searching patients:', error);
      alert('Error Searching Patients');
    });
}


function displayPatients(data) {
  const tableBody = document.querySelector('#patientsTable tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  if (data.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="7">No patients found</td>`;
    tableBody.appendChild(row);
    return;
  }

  data.forEach(patient => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${patient.id}</td>
      <td>${patient.name}</td>
      <td>${patient.phone_no}</td>
      <td>${patient.age}</td>
      <td>${patient.blood_group}</td>
      <td>${patient.patient_type}</td>
      <td>${patient.residence_cost || 'N/A'}</td>
    `;
    tableBody.appendChild(row);
  });
}


document.querySelectorAll("nav a").forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});