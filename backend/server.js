const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const app = express();
const PORT = 3000;

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "new-hospital-management",
  password: "12345",
  port: 5432,
});

// Middleware
// Enable CORS for all routes
// app.use(cors({
//   origin: "http://127.0.0.1:5501",
//   credentials: true
// }));

const corsOptions = {
  origin: ["http://127.0.0.1:5501", "http://localhost:5501"],
  credentials: true
};

app.use(cors(corsOptions));



app.use(express.json());
const path = require('path');

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));


//new update, make console "npm install express-session" an add the below
const session = require("express-session");

app.use(session({
  secret: "my_super_secret_key", // use a secure, random string in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,       // Set true only if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2  // 2 hours
  }
}));

// 4. Debug middleware — ADD THIS HERE
app.use((req, res, next) => {
  console.log("Session:", req.session);
  next();
});


// Test DB connection
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});
//add person api
app.post("/person", async (req, res) => {
  const { id, name, phone_no, age, blood_group, person_type } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO person (id, name, phone_no, age, blood_group, person_type)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [id, name, phone_no, age, blood_group, person_type]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting person:", err);
    res.status(500).send("Failed to create person");
  }
});



// add employee
app.post("/employee", async (req, res) => {
  const { employee_id, salary, employee_type } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO employee (employee_id, salary, employee_type)
      VALUES ($1, $2, $3) RETURNING *
    `, [employee_id, salary, employee_type]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting employee:", err);
    res.status(500).send("Failed to insert employee");
  }
});

// Create patient
app.post("/patient", async (req, res) => {
  const { patient_id, patient_type } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO patient (patient_id, patient_type) VALUES ($1, $2) RETURNING *",
      [patient_id, patient_type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting patient:", err);
    res.status(500).send("Failed to insert patient");
  }
});

//Create resident patient
app.post("/resident_patient", async (req, res) => {
  const { patient_id, unit_no, residence_type, department_id, day_count, residence_cost } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO resident_patient
       (patient_id, unit_no, residence_type, department_id, day_count, residence_cost)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [patient_id, unit_no, residence_type, department_id, day_count, residence_cost]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting resident_patient:", err);
    res.status(500).send("Failed to insert resident patient");
  }
});

//Get all patients
app.get("/patients", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.phone_no,
        p.age,
        p.blood_group,
        pt.patient_type,
        rp.residence_cost
      FROM person p
      JOIN patient pt ON pt.patient_id = p.id
      LEFT JOIN resident_patient rp ON rp.patient_id = pt.patient_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching patients list: ", err);
    res.status(500).send("Error fetching patients list");
  }
});

//add doctor
app.post("/doctor", async (req, res) => {
  const { doctor_id, department_id, email, password } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO doctor (doctor_id, department_id, email, password)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [doctor_id, department_id, email, password]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting doctor:", err);
    res.status(500).send("Failed to insert doctor");
  }
});

//Get doctors list
app.get("/doctors", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.doctor_id, d.department_id, d.email, p.name
      FROM doctor d
      JOIN employee e ON d.doctor_id = e.employee_id
      JOIN person p ON e.employee_id = p.id
    `);

    console.log("Doctor API Response:", result.rows); 

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching list of doctors:", err);
    res.status(501).send("Error fetching doctors list");
  }
});
//posting appointments
app.post("/appointments", async (req, res) => {
  const { appointment_id, patient_id, doctor_id, appointment_date, appointment_charge } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO appointment (appointment_id, patient_id, doctor_id, appointment_date, appointment_charge)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [appointment_id, patient_id, doctor_id, appointment_date, appointment_charge]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error booking appointment:", err);
    res.status(500).send("Error booking appointment");
  }
});
//post prescription api
app.post('/prescriptions', async (req, res) => {
  const { prescription_id, appointment_id, prescription_date, tests } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert using the provided prescription_id
    await client.query(
      `INSERT INTO prescription (prescription_id, appointment_id, prescription_date)
       VALUES ($1, $2, $3)`,
      [prescription_id, appointment_id, prescription_date]
    );

    // Insert each test
    for (const test of tests) {
      await client.query(
        `INSERT INTO test (test_name, prescription_id, test_cost, test_date)
         VALUES ($1, $2, $3, $4)`,
        [test.test_name, prescription_id, test.test_cost, test.test_date]
      );
    }

    await client.query('COMMIT');
    res.status(200).send('Prescription and tests added successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error inserting prescription and tests:', err);
    res.status(500).send('Failed to save prescription');
  } finally {
    client.release();
  }
});

//Get all prescription
app.get('/prescriptions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.prescription_id, p.appointment_id, p.prescription_date,
        t.test_id, t.test_name, t.test_cost, t.test_date
      FROM prescription p
      LEFT JOIN test t ON p.prescription_id = t.prescription_id
      ORDER BY p.prescription_id
    `);

    // Group tests under each prescription
    const prescriptions = {};
    result.rows.forEach(row => {
      if (!prescriptions[row.prescription_id]) {
        prescriptions[row.prescription_id] = {
          prescription_id: row.prescription_id,
          appointment_id: row.appointment_id,
          prescription_date: row.prescription_date,
          tests: []
        };
      }

      if (row.test_id) {
        prescriptions[row.prescription_id].tests.push({
          test_id: row.test_id,
          test_name: row.test_name,
          test_cost: row.test_cost,
          test_date: row.test_date
        });
      }
    });

    res.json(Object.values(prescriptions));
  } catch (err) {
    console.error("Error fetching prescriptions:", err);
    res.status(500).send("Failed to fetch prescriptions");
  }
});

// Get all appointments
app.get("/appointments", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.appointment_id,
        a.appointment_date,
        a.appointment_charge,
        patient_person.name AS patient_name,
        doctor_person.name AS doctor_name,
        d.email AS doctor_email,
        dept.department_name
      FROM appointment a
      JOIN patient pt ON pt.patient_id = a.patient_id
      JOIN person patient_person ON patient_person.id = pt.patient_id
      JOIN doctor d ON d.doctor_id = a.doctor_id
      JOIN employee e ON d.doctor_id = e.employee_id
      JOIN person doctor_person ON doctor_person.id = e.employee_id
      JOIN department dept ON d.department_id = dept.department_id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching appointments list:", err);
    res.status(500).send("Error fetching appointments list");
  }
});




// Add Diagnosis
app.post("/diagnosis", async (req, res) => {
  const { test_id, result } = req.body;

  try {
    const resultInsert = await pool.query(
      `INSERT INTO diagnosis (test_id, result)
       VALUES ($1, $2)
       RETURNING *`,  
      [test_id, result]
    );

    res.status(201).json(resultInsert.rows[0]); // send back the inserted row
  } catch (err) {
    console.error("Error inserting diagnosis:", err);
    res.status(500).send("Failed to insert diagnosis");
  }
});

// Add Treatment
app.post("/treatment", async (req, res) => {
  const { diagnosis_id, treatment_type, treatment_cost } = req.body;
  try {
    const resultInsert = await pool.query(
      `INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [diagnosis_id, treatment_type, treatment_cost]
    );
    res.status(201).json(resultInsert.rows[0]);
  } catch (err) {
    console.error("Error inserting treatment:", err);
    res.status(500).send("Failed to insert treatment");
  }
});

app.get("/tests", async (req, res) => {
  try {
    const result = await pool.query("SELECT test_id, test_name FROM test");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching tests:", err);
    res.status(500).send("Error fetching tests");
  }
});

app.get("/diagnoses", async (req, res) => {
  const result = await pool.query("SELECT * FROM diagnosis");
  res.json(result.rows);
});

//Post bills 
app.post('/bills', async (req, res) => {
  const {
    patient_id,
    cashier_id,
    test_charge,
    medicine_charge,
    appointment_charge,
    residence_charge,
    treatment_charge,
    total_charge
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO bill
       (patient_id, cashier_id, test_charge, medicine_charge, appointment_charge, residence_charge, treatment_charge, total_charge)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        patient_id,
        cashier_id,
        test_charge,
        medicine_charge,
        appointment_charge,
        residence_charge,
        treatment_charge,
        total_charge
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting bill:", err);
    res.status(500).send("Failed to generate bill");
  }
});

//Get bills
app.get("/bills", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.bill_id,
        b.residence_charge,
        b.medicine_charge,
        b.treatment_charge,
        b.test_charge,
        b.total_charge,
        p.name AS patient_name
      FROM bill b
      JOIN patient pt ON pt.patient_id = b.patient_id
      JOIN person p ON p.id = pt.patient_id
      ORDER BY b.bill_id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching bills:", err);
    res.status(500).send("Failed to fetch bills");
  }
});

//Post hospital record
app.post("/hospital_record", async (req, res) => {
  const {
    patient_id,
    bill_id,
    cashier_id,
    admission_date,
    discharge_date,
    disease
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO hospital_record
       (patient_id, bill_id, admission_date, discharge_date, disease, cashier_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [patient_id, bill_id, admission_date, discharge_date, disease, cashier_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting hospital record:", err);
    res.status(500).send("Failed to add hospital record");
  }
});




app.get('/patients/search', async (req, res) => {
  const { type, value } = req.query;

  try {
    let query = '';
    let params = [];

    if (type === 'id') {
      query = `
        SELECT p.id, p.name, p.phone_no, p.age, p.blood_group::text AS blood_group, pt.patient_type::text AS patient_type
        FROM person p
        JOIN patient pt ON p.id = pt.patient_id
        WHERE p.id = $1
      `;
      params = [value];
    } else if (type === 'name') {
      query = `
        SELECT p.id, p.name, p.phone_no, p.age, p.blood_group::text AS blood_group, pt.patient_type::text AS patient_type
        FROM person p
        JOIN patient pt ON p.id = pt.patient_id
        WHERE LOWER(p.name) LIKE LOWER($1)
      `;
      params = [`%${value}%`];
    } else if (type === 'blood_group') {
      query = `
        SELECT p.id, p.name, p.phone_no, p.age, p.blood_group::text AS blood_group, pt.patient_type::text AS patient_type
        FROM person p
        JOIN patient pt ON p.id = pt.patient_id
        WHERE p.blood_group::text = $1
      `;
      params = [value];
    } else if (type === 'patient_type') {
      query = `
        SELECT p.id, p.name, p.phone_no, p.age, p.blood_group::text AS blood_group, pt.patient_type::text AS patient_type
        FROM person p
        JOIN patient pt ON p.id = pt.patient_id
        WHERE pt.patient_type::text = $1
      `;
      params = [value];
    } else {
      return res.status(400).json({ error: 'Invalid search type' });
    }

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Database search failed' });
  }
});




app.get("/appointments/search", async (req, res) => {
  const { type, value } = req.query;

  let query = `
    SELECT 
      a.appointment_id,
      a.appointment_date,
      a.appointment_charge,
      p.name AS patient_name,
      dp.department_name,
      per.name AS doctor_name,
      d.email AS doctor_email
    FROM appointment a
    JOIN patient pt ON pt.patient_id = a.patient_id
    JOIN person p ON p.id = pt.patient_id
    JOIN doctor d ON d.doctor_id = a.doctor_id
    JOIN department dp ON dp.department_id = d.department_id
    JOIN employee e ON e.employee_id = d.doctor_id
    JOIN person per ON per.id = e.employee_id
  `;

  let condition = "";
  let params = [];

  if (type === "patient") {
    condition = `WHERE LOWER(p.name) LIKE LOWER($1)`;
    params.push(`%${value}%`);
  } else if (type === "doctor") {
    condition = `WHERE LOWER(per.name) LIKE LOWER($1)`;
    params.push(`%${value}%`);
  } else if (type === "department") {
    condition = `WHERE LOWER(dp.department_name) LIKE LOWER($1)`;
    params.push(`%${value}%`);
  }

  try {
    const result = await pool.query(query + " " + condition, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Search appointments failed:", err);
    res.status(500).send("Search failed");
  }
});


app.get('/prescriptions/search', async (req, res) => {
  const { type, value } = req.query;

  let baseQuery = `
    SELECT 
      p.prescription_id,
      p.appointment_id,
      p.prescription_date,
      t.test_id,
      t.test_name,
      t.test_cost,
      t.test_date
    FROM prescription p
    LEFT JOIN test t ON p.prescription_id = t.prescription_id
  `;

  let condition = '';
  const params = [];

  if (type === 'appointment_id') {
    condition = 'WHERE p.appointment_id::TEXT = $1';
    params.push(value);
  } else if (type === 'prescription_date') {
    condition = 'WHERE p.prescription_date::TEXT = $1';
    params.push(value);
  } else if (type === 'test_name') {
    condition = 'WHERE LOWER(t.test_name) LIKE LOWER($1)';
    params.push(`%${value}%`);
  } else {
    return res.status(400).json({ error: 'Invalid search type' });
  }

  try {
    const result = await pool.query(`${baseQuery} ${condition} ORDER BY p.prescription_id`, params);

    // Group tests under each prescription
    const prescriptions = {};
    result.rows.forEach(row => {
      if (!prescriptions[row.prescription_id]) {
        prescriptions[row.prescription_id] = {
          prescription_id: row.prescription_id,
          appointment_id: row.appointment_id,
          prescription_date: row.prescription_date,
          tests: []
        };
      }

      if (row.test_id) {
        prescriptions[row.prescription_id].tests.push({
          test_id: row.test_id,
          test_name: row.test_name,
          test_cost: row.test_cost,
          test_date: row.test_date
        });
      }
    });

    res.json(Object.values(prescriptions));
  } catch (err) {
    console.error("Error in prescription search:", err);
    res.status(500).json({ error: "Search failed" });
  }
});



app.get("/bills/search", async (req, res) => {
  const { type, value, min, max } = req.query;

  let condition = "";
  let params = [];
  const baseQuery = `
    SELECT 
      b.bill_id,
      b.residence_charge,
      b.medicine_charge,
      b.treatment_charge,
      b.test_charge,
      b.total_charge,
      p.name AS patient_name
    FROM bill b
    JOIN patient pt ON pt.patient_id = b.patient_id
    JOIN person p ON p.id = pt.patient_id
  `;

  if (type === "patient_name") {
    condition = "WHERE LOWER(p.name) LIKE LOWER($1)";
    params.push(`%${value}%`);
  } else if (["residence_charge", "medicine_charge", "treatment_charge", "test_charge", "total_charge"].includes(type)) {
    if (min && max) {
      condition = `WHERE b.${type} BETWEEN $1 AND $2`;
      params.push(Number(min), Number(max));
    } else {
      condition = `WHERE b.${type} >= $1`;
      params.push(Number(min));
    }
  } else {
    return res.status(400).json({ error: "Invalid search type" });
  }

  try {
    const result = await pool.query(`${baseQuery} ${condition} ORDER BY b.bill_id DESC`, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Error searching bills:", err);
    res.status(500).json({ error: "Failed to search bills" });
  }
});

 

app.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(`
      SELECT a.admin_id, a.email, p.name
      FROM admin a
      JOIN person p ON p.id = a.admin_id
      WHERE a.email = $1 AND a.password = $2
    `, [email, password]);

    if (result.rows.length === 0) {
      return res.status(401).send("Invalid credentials");
    }

    // Set session for admin
    req.session.admin = {
      id: result.rows[0].admin_id,
      name: result.rows[0].name,
      email: result.rows[0].email
    };

    console.log("Admin session set:", req.session.admin); // optional for debugging

    res.json({ message: "Login successful", admin: req.session.admin });
  } catch (err) {
    console.error("Error during admin login:", err);
    res.status(500).send("Server error during login");
  }
});


app.post("/insert-doctor", async (req, res) => {
  console.log("Insert doctor session:", req.session.admin);
  const admin = req.session.admin;
  if (!admin) return res.status(401).send("Not logged in");

  const { name, phone, age, blood_group, department_id, email, password } = req.body;

  try {
    // 1. Get next id
    const nextIdResult = await pool.query("SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM person");
    const nextId = nextIdResult.rows[0].next_id;

    // 2. Insert into person
    await pool.query(`
      INSERT INTO person (id, name, phone_no, age, blood_group, person_type)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [nextId, name, phone, age, blood_group, 'employee']);

    // 3. Insert into employee
    await pool.query(`
      INSERT INTO employee (employee_id, salary, employee_type)
      VALUES ($1, FLOOR(RANDOM() * 30000 + 30000), 'doctor')
    `, [nextId]);

    // 4. Insert into doctor
    await pool.query(`
      INSERT INTO doctor (doctor_id, department_id, email, password)
      VALUES ($1, $2, $3, $4)
    `, [nextId, department_id, email, password]);

    // 5. Insert into insertion_log
    await pool.query(`
      INSERT INTO insertion_log (entity_type, inserted_entity_name, admin_id, admin_name, admin_email)
      VALUES ($1, $2, $3, $4, $5)
    `, ["doctor", name, admin.id, admin.name, admin.email]);

    res.status(201).json({ success: true, id: nextId });
  } catch (err) {
    console.error("Error inserting doctor:", err);
    res.status(500).send("Failed to insert doctor");
  }
});



app.post("/insert-nurse", async (req, res) => {
  console.log("Insert nurse session:", req.session.admin);
  const admin = req.session.admin;
  if (!admin) return res.status(401).send("Not logged in");

  const { name, phone, age, blood_group, department_id, shift_length } = req.body;

  try {
    const personResult = await pool.query(
      `INSERT INTO person (id, name, phone_no, age, blood_group, person_type)
       VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM person), $1, $2, $3, $4, 'employee')
       RETURNING id`,
      [name, phone, age, blood_group]
    );

    const id = personResult.rows[0].id;

    await pool.query(
      `INSERT INTO employee (employee_id, salary, employee_type)
       VALUES ($1, FLOOR(RANDOM() * 20000 + 20000), 'nurse')`,
      [id]
    );

    await pool.query(
      `INSERT INTO nurse (nurse_id, work_hour, department_id)
       VALUES ($1, $2, $3)`,
      [id, shift_length, department_id]
    );

    await pool.query(
      `INSERT INTO insertion_log (entity_type, inserted_entity_name, admin_id, admin_name, admin_email)
       VALUES ('nurse', $1, $2, $3, $4)`,
      [name, admin.id, admin.name, admin.email]
    );

    res.status(201).json({ success: true, id });
  } catch (err) {
    console.error("Error inserting nurse:", err);
    res.status(500).send("Failed to insert nurse");
  }
});


app.post("/insert-cashier", async (req, res) => {
  const admin = req.session.admin;
  if (!admin) return res.status(401).send("Not logged in");

  const { name, phone: phone_no, age, blood_group, department_id } = req.body;

  try {
    const personIdResult = await pool.query(`SELECT MAX(id) AS max_id FROM person`);
    const nextId = (personIdResult.rows[0].max_id || 0) + 1;

    await pool.query(
      `INSERT INTO person (id, name, phone_no, age, blood_group, person_type)
       VALUES ($1, $2, $3, $4, $5, 'employee')`,
      [nextId, name, phone_no, age, blood_group]
    );

    await pool.query(
      `INSERT INTO employee (employee_id, salary, employee_type)
       VALUES ($1, FLOOR(RANDOM() * 15000 + 15000), 'cashier')`,
      [nextId]
    );

    await pool.query(
      `INSERT INTO cashier (cashier_id, booth_no)
       VALUES ($1, $2)`,
      [nextId, department_id]
    );

    await pool.query(
      `INSERT INTO insertion_log (entity_type, inserted_entity_name, admin_id, admin_name, admin_email)
       VALUES ($1, $2, $3, $4, $5)`,
      ["cashier", name, admin.id, admin.name, admin.email]
    );

    res.status(201).json({ success: true, id: nextId });
  } catch (err) {
    console.error("Error inserting cashier:", err);
    res.status(500).send(err.message || "Failed to insert cashier");
  }
});

// Get list of all doctors
app.get("/get-doctors", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.name
      FROM doctor d
      JOIN employee e ON d.doctor_id = e.employee_id
      JOIN person p ON e.employee_id = p.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).send("Failed to fetch doctors");
  }
});

// Get full details of a doctor
app.get("/get-doctor-details/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT p.name, p.age, p.phone_no, p.blood_group, d.department_id, d.email
      FROM doctor d
      JOIN employee e ON d.doctor_id = e.employee_id
      JOIN person p ON e.employee_id = p.id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) return res.status(404).send("Not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching doctor details:", err);
    res.status(500).send("Failed to fetch doctor details");
  }
});

// Delete doctor
app.delete("/delete-doctor/:id", async (req, res) => {
  const admin = req.session.admin;
  if (!admin) return res.status(401).send("Unauthorized");

  const { id } = req.params;

  try {
    const result = await pool.query(`SELECT name FROM person WHERE id = $1`, [id]);
    if (result.rows.length === 0) return res.status(404).send("Doctor not found");
    const name = result.rows[0].name;

    await pool.query(`DELETE FROM doctor WHERE doctor_id = $1`, [id]);
    await pool.query(`DELETE FROM employee WHERE employee_id = $1`, [id]);
    await pool.query(`DELETE FROM person WHERE id = $1`, [id]);

    await pool.query(`
      INSERT INTO deletion_log (entity_type, deleted_entity_name, admin_id, admin_name, admin_email)
      VALUES ('doctor', $1, $2, $3, $4)
    `, [name, admin.id, admin.name, admin.email]);

    res.status(200).send("Doctor deleted successfully");
  } catch (err) {
    console.error("Error deleting doctor:", err);
    res.status(500).send("Failed to delete doctor");
  }
});

app.get("/get-all-nurses", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.name, p.phone_no, p.age, p.blood_group,
             n.department_id, n.work_hour
      FROM nurse n
      JOIN employee e ON n.nurse_id = e.employee_id
      JOIN person p ON e.employee_id = p.id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching nurses:", err);
    res.status(500).send("Failed to fetch nurses");
  }
});

app.delete("/delete-nurse/:id", async (req, res) => {
  const admin = req.session.admin;
  if (!admin) return res.status(401).send("Not logged in");

  const id = req.params.id;

  try {
    // Get nurse name for log
    const nameResult = await pool.query(`SELECT name FROM person WHERE id = $1`, [id]);
    const name = nameResult.rows[0]?.name || "Unknown Nurse";

    // Delete from all tables (order matters due to FKs)
    await pool.query(`DELETE FROM nurse WHERE nurse_id = $1`, [id]);
    await pool.query(`DELETE FROM employee WHERE employee_id = $1`, [id]);
    await pool.query(`DELETE FROM person WHERE id = $1`, [id]);

    // Log deletion
    await pool.query(`
      INSERT INTO deletion_log (entity_type, deleted_entity_name, admin_id, admin_name, admin_email)
      VALUES ('nurse', $1, $2, $3, $4)
    `, [name, admin.id, admin.name, admin.email]);

    res.status(200).send("Nurse deleted");
  } catch (err) {
    console.error("Error deleting nurse:", err);
    res.status(500).send("Failed to delete nurse");
  }
});

app.get("/get-all-cashiers", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.name, p.phone_no, p.age, p.blood_group,
             c.booth_no
      FROM cashier c
      JOIN employee e ON c.cashier_id = e.employee_id
      JOIN person p ON e.employee_id = p.id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching cashiers:", err);
    res.status(500).send("Failed to fetch cashiers");
  }
});

app.delete("/delete-cashier/:id", async (req, res) => {
  const admin = req.session.admin;
  if (!admin) return res.status(401).send("Not logged in");

  const id = req.params.id;

  try {
    // Get cashier name for logging
    const nameResult = await pool.query(`SELECT name FROM person WHERE id = $1`, [id]);
    const name = nameResult.rows[0]?.name || "Unknown Cashier";

    // Delete from tables in order: cashier → employee → person
    await pool.query(`DELETE FROM cashier WHERE cashier_id = $1`, [id]);
    await pool.query(`DELETE FROM employee WHERE employee_id = $1`, [id]);
    await pool.query(`DELETE FROM person WHERE id = $1`, [id]);

    // Log deletion
    await pool.query(`
      INSERT INTO deletion_log (entity_type, deleted_entity_name, admin_id, admin_name, admin_email)
      VALUES ('cashier', $1, $2, $3, $4)
    `, [name, admin.id, admin.name, admin.email]);

    res.status(200).send("Cashier deleted");
  } catch (err) {
    console.error("Error deleting cashier:", err);
    res.status(500).send("Failed to delete cashier");
  }
});

app.get("/all-doctors", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.name, e.salary
      FROM person p
      JOIN employee e ON p.id = e.employee_id
      WHERE e.employee_type = 'doctor'
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).send("Failed to fetch doctors");
  }
});


app.post("/update-doctor-salary", async (req, res) => {
  const admin = req.session.admin;
  if (!admin) return res.status(401).send("Not logged in");

  const { doctor_id, new_salary } = req.body;

  try {
    // Fetch old salary
    const result = await pool.query(
      `SELECT salary FROM employee WHERE employee_id = $1 AND employee_type = 'doctor'`,
      [doctor_id]
    );

    if (result.rowCount === 0)
      return res.status(404).send("Doctor not found");

    const old_salary = result.rows[0].salary;

    // Update salary
    await pool.query(
      `UPDATE employee SET salary = $1 WHERE employee_id = $2`,
      [new_salary, doctor_id]
    );

    // Log update
    await pool.query(
      `INSERT INTO updating_log (
        employee_id, employee_type, old_salary, new_salary, 
        updated_by_admin_id, updated_by_admin_name, updated_by_admin_email
      ) VALUES ($1, 'doctor', $2, $3, $4, $5, $6)`,
      [doctor_id, old_salary, new_salary, admin.id, admin.name, admin.email]
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error updating doctor salary:", err);
    res.status(500).send("Internal server error");
  }
});


app.get("/get-nurses", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.employee_id AS id, p.name, e.salary
      FROM nurse n
      JOIN employee e ON e.employee_id = n.nurse_id
      JOIN person p ON p.id = e.employee_id
      ORDER BY p.name
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching nurses:", err);
    res.status(500).send("Failed to fetch nurses");
  }
});
 

app.post("/update-nurse", async (req, res) => {
  const admin = req.session.admin;
  if (!admin) return res.status(401).send("Not logged in");

  const { id, name, oldSalary, newSalary } = req.body;
  console.log(" POST /update-nurse hit:", req.body);

  try {
    // Update employee table
    const updateResult = await pool.query(
      `UPDATE employee SET salary = $1 WHERE employee_id = $2`,
      [newSalary, id]
    );

    if (updateResult.rowCount === 0) {
      console.log(" No employee row updated");
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    console.log("Salary updated for nurse:", name);

    // Insert into updating_log
    await pool.query(
      `INSERT INTO updating_log 
        (employee_id, employee_type, old_salary, new_salary, updated_by_admin_id, updated_by_admin_name, updated_by_admin_email)
       VALUES ($1, 'nurse', $2, $3, $4, $5, $6)`,
      [id, oldSalary, newSalary, admin.id, admin.name, admin.email]
    );

    console.log(" Log entry created in updating_log");

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(" Error in /update-nurse:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.get("/get-cashiers", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.name, e.salary
      FROM person p
      JOIN employee e ON p.id = e.employee_id
      WHERE e.employee_type = 'cashier'
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching cashiers:", err);
    res.status(500).send("Failed to fetch cashiers");
  }
});

app.post("/update-cashier", async (req, res) => {
  const admin = req.session.admin;
  if (!admin) return res.status(401).send("Not logged in");

  const { id, name, oldSalary, newSalary } = req.body;
  console.log("POST /update-cashier hit:", req.body);

  try {
    await pool.query(`UPDATE employee SET salary = $1 WHERE employee_id = $2`, [newSalary, id]);

    await pool.query(
      `INSERT INTO updating_log (employee_id, employee_type, old_salary, new_salary, updated_by_admin_id, updated_by_admin_name, updated_by_admin_email)
       VALUES ($1, 'cashier', $2, $3, $4, $5, $6)`,
      [id, oldSalary, newSalary, admin.id, admin.name, admin.email]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error updating cashier salary:", err);
    res.status(500).send("Failed to update cashier");
  }
});


// Add Hospital Record
app.post('/add-hospital-record', async (req, res) => {
  const { patient_id, admission_date, discharge_date, disease } = req.body;
  try {
    const result = await pool.query(
      `SELECT add_hospital_record($1, $2, $3, $4) AS message`,
      [patient_id, admission_date, discharge_date, disease]
    );
    res.json({ message: result.rows[0].message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// // View Hospital Record
// app.get('/view-hospital-record/:patient_id', async (req, res) => {
//   const { patient_id } = req.params;
//   try {
//     const result = await pool.query(
//       `SELECT * FROM view_hospital_record($1)`,
//       [patient_id]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// });


app.get('/view-hospital-records', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        hr.record_id,
        hr.patient_id,
        per.name AS patient_name,
        hr.admission_date,
        hr.discharge_date,
        hr.disease,
        b.total_charge
      FROM hospital_record hr
      JOIN patient pat ON hr.patient_id = pat.patient_id
      JOIN person per ON pat.patient_id = per.id
      JOIN bill b ON hr.bill_id = b.bill_id
      ORDER BY hr.record_id DESC;
    `);
    console.log('got resule'+result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching hospital records:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/cashier-login', async (req, res) => {
  const { name, password } = req.body;

  const expectedPassword = name.toLowerCase().split(' ')[0];
  try {
    const result = await pool.query(`
      SELECT p.id, p.name
      FROM person p
      JOIN employee e ON p.id = e.employee_id
      JOIN cashier c ON e.employee_id = c.cashier_id
      WHERE LOWER(p.name) = $1
    `, [name.toLowerCase()]);

    if (result.rows.length === 0 || expectedPassword !== password.toLowerCase()) {
      return res.status(401).send('Invalid credentials');
    }

    const user = result.rows[0];
    return res.status(200).json({ id: user.id, name: user.name }); 
  } catch (err) {
    console.error("DB error:", err);
    return res.status(500).send('Server error');
  }
});




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

