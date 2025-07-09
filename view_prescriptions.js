document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/prescriptions')
    .then(res => res.json())
    .then(prescriptions => {
      const tableBody = document.querySelector('#prescriptionsTable tbody');

      if (prescriptions.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4">No prescriptions found.</td>';
        tableBody.appendChild(row);
        return;
      }

      prescriptions.forEach(p => {
        if (p.tests.length > 0) {
          p.tests.forEach(t => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${p.appointment_id}</td>
              <td>${p.prescription_date}</td>
              <td>${t.test_name}</td>
              <td>₹${t.test_cost}</td>
            `;
            tableBody.appendChild(row);
          });
        } else {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${p.appointment_id}</td>
            <td>${p.prescription_date}</td>
            <td colspan="2">No tests</td>
          `;
          tableBody.appendChild(row);
        }
      });
    })
    .catch(err => {
      console.error('Error loading prescriptions:', err);
      alert('Failed to load prescriptions');
    });
});



document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#prescriptionsTable tbody');
  const searchBtn = document.getElementById('searchBtn');
  const searchType = document.getElementById('searchType');
  const searchInput = document.getElementById('searchInput');

  const loadPrescriptions = (query = '') => {
    const url = query ? `http://localhost:3000/prescriptions/search?${query}` : 'http://localhost:3000/prescriptions';

    fetch(url)
      .then(res => res.json())
      .then(prescriptions => {
        tableBody.innerHTML = '';

        if (prescriptions.length === 0) {
          const row = document.createElement('tr');
          row.innerHTML = '<td colspan="4">No prescriptions found.</td>';
          tableBody.appendChild(row);
          return;
        }

        prescriptions.forEach(p => {
          if (p.tests.length > 0) {
            p.tests.forEach(t => {
              const row = document.createElement('tr');
              row.innerHTML = `
                <td>${p.appointment_id}</td>
                <td>${p.prescription_date}</td>
                <td>${t.test_name}</td>
                <td>₹${t.test_cost}</td>
              `;
              tableBody.appendChild(row);
            });
          } else {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${p.appointment_id}</td>
              <td>${p.prescription_date}</td>
              <td colspan="2">No tests</td>
            `;
            tableBody.appendChild(row);
          }
        });
      })
      .catch(err => {
        console.error('Error loading prescriptions:', err);
        alert('Failed to load prescriptions');
      });
  };

  // Initial load
  loadPrescriptions();

  // Search handler
  searchBtn.addEventListener('click', () => {
    const type = searchType.value;
    const value = searchInput.value.trim();

    if (value === '') {
      loadPrescriptions();
    } else {
      const query = `type=${type}&value=${encodeURIComponent(value)}`;
      loadPrescriptions(query);
    }
  });
});

document.querySelectorAll("nav a").forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});

