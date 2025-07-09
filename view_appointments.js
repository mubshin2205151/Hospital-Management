document.addEventListener('DOMContentLoaded', () => {
  fetch("http://localhost:3000/appointments")
    .then(response => {
      if (!response.ok) throw new Error("Failed to fetch appointments");
      return response.json();
    })
    .then(appointments => {
      const tableBody = document.querySelector('#appointmentsTable tbody');
      tableBody.innerHTML = "";

      if (appointments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No appointments found.</td></tr>';
        return;
      }

      appointments.forEach(app => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${app.patient_name}</td>
          <td>${app.doctor_name} (${app.doctor_email})</td>
          <td>${app.department_name}</td>    
          <td>${app.appointment_date}</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Failed to load appointments");
    });
});




document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#appointmentsTable tbody');
  const searchType = document.getElementById("searchType");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  const loadAppointments = (query = "") => {
    const url = query ? `http://localhost:3000/appointments/search?${query}` : `http://localhost:3000/appointments`;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch appointments");
        return res.json();
      })
      .then(appointments => {
        tableBody.innerHTML = "";

        if (appointments.length === 0) {
          tableBody.innerHTML = '<tr><td colspan="4">No appointments found.</td></tr>';
          return;
        }

        appointments.forEach(app => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${app.patient_name}</td>
            <td> ${app.doctor_name} (${app.doctor_email})</td>
            <td>${app.department_name}</td>    
            <td>${app.appointment_date}</td>
          `;
          tableBody.appendChild(row);
        });
      })
      .catch(err => {
        console.error("Error:", err);
        alert("Failed to load appointments");
      });
  };

  // Initial load
  loadAppointments();

  // Search button handler
  searchBtn.addEventListener("click", () => {
    const type = searchType.value;
    const value = searchInput.value.trim();

    if (value === "") return loadAppointments();

    const query = `type=${type}&value=${encodeURIComponent(value)}`;
    loadAppointments(query);
  });
});




document.querySelectorAll("nav a").forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});