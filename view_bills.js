document.addEventListener('DOMContentLoaded', () => {
  fetch("http://localhost:3000/bills")
    .then(res => res.json())
    .then(bills => {
      const tableBody = document.querySelector('#billsTable tbody');
      tableBody.innerHTML = '';

      if (bills.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">No bills found.</td></tr>';
        return;
      }

      bills.forEach(bill => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${bill.patient_name}</td>
          <td>₹${bill.residence_charge}</td>
          <td>₹${bill.medicine_charge}</td>
          <td>₹${bill.treatment_charge}</td>
          <td>₹${bill.test_charge}</td>
          <td>₹${bill.total_charge}</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(err => {
      console.error("Error loading bills:", err);
      alert("Failed to load bills");
    });
});



document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#billsTable tbody');
  const searchBtn = document.getElementById('searchBtn');
  const searchType = document.getElementById('searchType');
  const searchInput1 = document.getElementById('searchInput1');
  const searchInput2 = document.getElementById('searchInput2');

  const loadBills = (query = '') => {
    const url = query ? `http://localhost:3000/bills/search?${query}` : 'http://localhost:3000/bills';

    fetch(url)
      .then(res => res.json())
      .then(bills => {
        tableBody.innerHTML = '';

        if (bills.length === 0) {
          tableBody.innerHTML = '<tr><td colspan="6">No bills found.</td></tr>';
          return;
        }

        bills.forEach(bill => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${bill.patient_name}</td>
            <td>₹${bill.residence_charge}</td>
            <td>₹${bill.medicine_charge}</td>
            <td>₹${bill.treatment_charge}</td>
            <td>₹${bill.test_charge}</td>
            <td>₹${bill.total_charge}</td>
          `;
          tableBody.appendChild(row);
        });
      })
      .catch(err => {
        console.error("Error loading bills:", err);
        alert("Failed to load bills");
      });
  };

  loadBills(); // Initial load

  searchBtn.addEventListener('click', () => {
    const type = searchType.value;
    const value1 = searchInput1.value.trim();
    const value2 = searchInput2.value.trim();

    if (type === 'patient_name') {
      if (value1 === '') {
        loadBills(); // empty reload
      } else {
        const query = `type=${type}&value=${encodeURIComponent(value1)}`;
        loadBills(query);
      }
    } else {
      if (value1 === '') {
        alert("Please enter at least a minimum value");
        return;
      }

      const query = `type=${type}&min=${encodeURIComponent(value1)}${value2 ? `&max=${encodeURIComponent(value2)}` : ''}`;
      loadBills(query);
    }
  });
});

document.querySelectorAll("nav a").forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});
