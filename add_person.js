document.getElementById("personForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const person = {
      id: parseInt(document.getElementById("id").value),
      name: document.getElementById("name").value,
      phone_no: document.getElementById("phone_no").value,
      age: parseInt(document.getElementById("age").value),
      blood_group: document.getElementById("blood_group").value,
      person_type: document.getElementById("person_type").value
    };
  
    fetch("http://localhost:3000/person", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(person)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to create person");
        return res.json();
      })
      .then(data => {
        alert("Person created successfully!");
        document.getElementById("personForm").reset();
      })
      .catch(err => {
        alert("Error: " + err.message);
      });
  });
  

  document.querySelectorAll("nav a").forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});