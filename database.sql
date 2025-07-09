
CREATE TYPE blood_group_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE person_type AS ENUM ('admin', 'employee', 'patient');
CREATE TYPE employee_type AS ENUM ('doctor', 'nurse', 'cashier');
CREATE TYPE patient_type AS ENUM ('resident', 'outpatient');    /*The patient_ID s who are not in "Resident_Patient", are outpatient*/
CREATE TYPE residence_type AS ENUM ('ward', 'cabin', 'icu');


CREATE TABLE department (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(15) NOT NULL
);

CREATE TABLE person (
    id INT PRIMARY KEY,
    name VARCHAR(30),
    phone_no VARCHAR(15),
    age INT,
    blood_group blood_group_type,
    person_type person_type
);

CREATE TABLE admin (
    admin_id INT PRIMARY KEY,
    email VARCHAR(30), 
    password VARCHAR(30),
    FOREIGN KEY (admin_id) REFERENCES person(id)
);

CREATE TABLE employee (
    employee_id INT PRIMARY KEY,
    salary INT,
    employee_type employee_type,
    FOREIGN KEY (employee_id) REFERENCES person(id)
);

CREATE TABLE cashier (
    cashier_id INT PRIMARY KEY,
    booth_no INT,
    FOREIGN KEY (cashier_id) REFERENCES employee(employee_id)
);

CREATE TABLE nurse (
    nurse_id INT PRIMARY KEY,
    work_hour DOUBLE PRECISION,
    department_id INT,
    FOREIGN KEY (nurse_id) REFERENCES employee(employee_id),
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE doctor (
    doctor_id INT PRIMARY KEY,
    department_id INT,
    email VARCHAR(50),
    password VARCHAR(50),
    FOREIGN KEY (doctor_id) REFERENCES employee(employee_id),
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE patient (
    patient_id INT PRIMARY KEY,
    patient_type patient_type,
    FOREIGN KEY (patient_id) REFERENCES person(id)
);

CREATE TABLE residence_unit (
    unit_no INT,
    residence_type residence_type,
    department_id INT,
    per_day_cost DOUBLE PRECISION,
    PRIMARY KEY (unit_no, residence_type),
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE resident_patient (
    patient_id INT PRIMARY KEY,
    unit_no INT,
    residence_type residence_type,
    department_id INT,
    day_count INT,
    residence_cost DOUBLE PRECISION,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (department_id) REFERENCES department(department_id),
    FOREIGN KEY (unit_no, residence_type) REFERENCES residence_unit(unit_no, residence_type)
);

CREATE TABLE appointment (
    appointment_id INT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    appointment_date DATE,
    appointment_charge DOUBLE PRECISION,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id)
);

CREATE TABLE prescription (
    prescription_id INT PRIMARY KEY,
    appointment_id INT,
	prescription_date DATE,
    FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id)
);

CREATE TABLE test (
    test_id INT PRIMARY KEY,
    test_name VARCHAR(50),
    prescription_id INT,
    test_cost DOUBLE PRECISION,
    test_date DATE,
	UNIQUE (test_name, prescription_id),  /*so that no two same test lie in same prescription*/
    FOREIGN KEY (prescription_id) REFERENCES prescription(prescription_id)
);

CREATE TABLE diagnosis (
    diagnosis_id INT PRIMARY KEY,
    test_id INT,
    result VARCHAR(100),
    FOREIGN KEY (test_id) REFERENCES test(test_id)
);

CREATE TABLE treatment (
    treatment_id INT PRIMARY KEY,
    diagnosis_id INT,
    treatment_type VARCHAR(50),
    treatment_cost DOUBLE PRECISION,
    FOREIGN KEY (diagnosis_id) REFERENCES diagnosis(diagnosis_id)
);

CREATE TABLE drug (
    drug_id INT PRIMARY KEY,
    name VARCHAR(30),
    price DOUBLE PRECISION
);

CREATE TABLE buys (
    patient_id INT,
    drug_id INT,
    amount INT,
    buy_date DATE,
    PRIMARY KEY (patient_id, drug_id),
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (drug_id) REFERENCES drug(drug_id)
);

CREATE TABLE bill (
    bill_id INT PRIMARY KEY,
    patient_id INT,
    cashier_id INT,
    test_charge DOUBLE PRECISION,
    medicine_charge DOUBLE PRECISION,
    appointment_charge DOUBLE PRECISION,
    residence_charge DOUBLE PRECISION,
    treatment_charge DOUBLE PRECISION,
    total_charge DOUBLE PRECISION,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (cashier_id) REFERENCES cashier(cashier_id)
);

CREATE TABLE hospital_record (
    record_id INT PRIMARY KEY,
    patient_id INT,
    bill_id INT,
    admission_date DATE,
    discharge_date DATE,
    disease VARCHAR(30),
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (bill_id) REFERENCES bill(bill_id)
);




CREATE SEQUENCE IF NOT EXISTS diagnosis_diagnosis_id_seq;

ALTER TABLE diagnosis
  ALTER COLUMN diagnosis_id SET DEFAULT nextval('diagnosis_diagnosis_id_seq');


CREATE SEQUENCE IF NOT EXISTS treatment_treatment_id_seq;

-- Set the default value of treatment_id to pull from the sequence
ALTER TABLE treatment
  ALTER COLUMN treatment_id SET DEFAULT nextval('treatment_treatment_id_seq');


CREATE SEQUENCE IF NOT EXISTS bill_bill_id_seq;

-- Set the default value of bill_id to pull from the sequence
ALTER TABLE bill
  ALTER COLUMN bill_id SET DEFAULT nextval('bill_bill_id_seq');


--dummy cashier insert to cheeck billing html : 
INSERT INTO person (id, name, phone_no, age, blood_group, person_type)
VALUES (45, 'Dummy Cashier', '0000000000', 30, 'O+', 'employee');

-- Step 2: Insert into employee
INSERT INTO employee (employee_id, salary, employee_type)
VALUES (45, 25000, 'cashier');

-- Step 3: Insert into cashier table
INSERT INTO cashier (cashier_id, booth_no)
VALUES (45, 1);



-- Drop any conflicting default if it was already set manually
ALTER TABLE hospital_record
ALTER COLUMN record_id DROP DEFAULT;

-- Drop identity if it was partially added before
ALTER TABLE hospital_record
ALTER COLUMN record_id DROP IDENTITY IF EXISTS;

-- Now add the clean identity column
ALTER TABLE hospital_record
ALTER COLUMN record_id ADD GENERATED ALWAYS AS IDENTITY;






-- Departments
INSERT INTO department VALUES (1, 'Cardiology');
INSERT INTO department VALUES (2, 'Neurology');
INSERT INTO department VALUES (3, 'Orthopedics');
INSERT INTO department VALUES (4, 'Pediatrics');
INSERT INTO department VALUES (5, 'Oncology');


-- Admins
INSERT INTO person VALUES (1, 'Abdur Rajjak', '01710000001', 56, 'A+', 'admin');
INSERT INTO person VALUES (2, 'Shahina Akter', '01710000002', 54, 'A-', 'admin');
INSERT INTO person VALUES (3, 'Rezaul Karim', '01710000003', 65, 'A+', 'admin');

INSERT INTO admin VALUES (1, 'abdur@hospital.com', 'pass1');
INSERT INTO admin VALUES (2, 'shahina@hospital.com', 'pass2');
INSERT INTO admin VALUES (3, 'rezaul@hospital.com', 'pass3');

-- Doctors (Employees)
INSERT INTO person VALUES (4, 'Dr. Provat Roy', '01710000004', 45, 'O+', 'employee');
INSERT INTO person VALUES (5, 'Dr. Nafisa Islam', '01710000005', 39, 'AB+', 'employee');
INSERT INTO person VALUES (6, 'Dr. Rakib Hossain', '01710000006', 50, 'O-', 'employee');
INSERT INTO person VALUES (7, 'Dr. Tanvir Alam', '01710000007', 43, 'AB-', 'employee');
INSERT INTO person VALUES (8, 'Dr. Priya Dutta', '01710000008', 38, 'B-', 'employee');

INSERT INTO employee VALUES (4, 70000, 'doctor');
INSERT INTO employee VALUES (5, 68000, 'doctor');
INSERT INTO employee VALUES (6, 72000, 'doctor');
INSERT INTO employee VALUES (7, 66000, 'doctor');
INSERT INTO employee VALUES (8, 71000, 'doctor');

INSERT INTO doctor VALUES (4, 2, 'provat.roy@hospital.com', 'docpass4');
INSERT INTO doctor VALUES (5, 3, 'nafisa.islam@hospital.com', 'docpass5');
INSERT INTO doctor VALUES (6, 5, 'rakib.hossain@hospital.com', 'docpass6');
INSERT INTO doctor VALUES (7, 1, 'tanvir.alam@hospital.com', 'docpass7');
INSERT INTO doctor VALUES (8, 4, 'priya.dutta@hospital.com', 'docpass8');

-- Nurses
INSERT INTO person VALUES (9, 'Razia Khatun', '01710000009', 35, 'O-', 'employee');
INSERT INTO person VALUES (10, 'Sadia Rahman', '01710000010', 29, 'B+', 'employee');
INSERT INTO person VALUES (11, 'Fahmida Yasmin', '01710000011', 41, 'A+', 'employee');
INSERT INTO person VALUES (12, 'Mehedi Hasan', '01710000012', 33, 'A-', 'employee');

INSERT INTO employee VALUES (9, 40000, 'nurse');
INSERT INTO employee VALUES (10, 42000, 'nurse');
INSERT INTO employee VALUES (11, 41000, 'nurse');
INSERT INTO employee VALUES (12, 39000, 'nurse');

INSERT INTO nurse VALUES (9, 10.3, 5);
INSERT INTO nurse VALUES (10, 8.4, 4);
INSERT INTO nurse VALUES (11, 11.0, 4);
INSERT INTO nurse VALUES (12, 8.7, 3);

-- Cashiers
INSERT INTO person VALUES (13, 'Monirul Islam', '01710000013', 30, 'B+', 'employee');
INSERT INTO person VALUES (14, 'Jannatul Ferdous', '01710000014', 32, 'A-', 'employee');
INSERT INTO person VALUES (15, 'Nayeem Chowdhury', '01710000015', 34, 'AB+', 'employee');

INSERT INTO employee VALUES (13, 30000, 'cashier');
INSERT INTO employee VALUES (14, 31000, 'cashier');
INSERT INTO employee VALUES (15, 29500, 'cashier');

INSERT INTO cashier VALUES (13, 1);
INSERT INTO cashier VALUES (14, 2);
INSERT INTO cashier VALUES (15, 1);



-- Patients (Residents and Outpatients)
INSERT INTO person VALUES (16, 'Arifuzzaman', '01710000016', 46, 'A-', 'patient');
INSERT INTO person VALUES (17, 'Sumaiya Sultana', '01710000017', 36, 'AB-', 'patient');
INSERT INTO person VALUES (18, 'Hridoy Hossain', '01710000018', 28, 'A+', 'patient');
INSERT INTO person VALUES (19, 'Nazmul Kabir', '01710000019', 37, 'B-', 'patient');
INSERT INTO person VALUES (20, 'Tania Rahman', '01710000020', 30, 'B-', 'patient');
INSERT INTO person VALUES (21, 'Morshed Alam', '01710000021', 55, 'B-', 'patient');
INSERT INTO person VALUES (22, 'Rumana Parvin', '01710000022', 40, 'A-', 'patient');
INSERT INTO person VALUES (23, 'Touhidul Islam', '01710000023', 58, 'B+', 'patient');
INSERT INTO person VALUES (24, 'Alifa Mahmud', '01710000024', 25, 'O+', 'patient');
INSERT INTO person VALUES (25, 'Khaled Hasan', '01710000025', 46, 'O-', 'patient');
INSERT INTO person VALUES (26, 'Rizwana Khan', '01710000026', 65, 'AB-', 'patient');
INSERT INTO person VALUES (27, 'Sajib Chowdhury', '01710000027', 47, 'AB+', 'patient');
INSERT INTO person VALUES (28, 'Maruf Mahmud', '01710000028', 50, 'AB-', 'patient');
INSERT INTO person VALUES (29, 'Labiba Islam', '01710000029', 18, 'AB+', 'patient');
INSERT INTO person VALUES (30, 'Adnan Zaman', '01710000030', 32, 'B-', 'patient');

-- Patient types
INSERT INTO patient VALUES (16, 'outpatient');
INSERT INTO patient VALUES (17, 'outpatient');
INSERT INTO patient VALUES (18, 'resident');
INSERT INTO patient VALUES (19, 'outpatient');
INSERT INTO patient VALUES (20, 'outpatient');
INSERT INTO patient VALUES (21, 'resident');
INSERT INTO patient VALUES (22, 'outpatient');
INSERT INTO patient VALUES (23, 'outpatient');
INSERT INTO patient VALUES (24, 'resident');
INSERT INTO patient VALUES (25, 'outpatient');
INSERT INTO patient VALUES (26, 'outpatient');
INSERT INTO patient VALUES (27, 'resident');
INSERT INTO patient VALUES (28, 'outpatient');
INSERT INTO patient VALUES (29, 'outpatient');
INSERT INTO patient VALUES (30, 'resident');


-- Residence Units
INSERT INTO residence_unit VALUES (101, 'ward', 1, 500.00);
INSERT INTO residence_unit VALUES (102, 'ward', 1, 500.00);
INSERT INTO residence_unit VALUES (103, 'cabin', 2, 1500.00);
INSERT INTO residence_unit VALUES (104, 'icu', 1, 5000.00);
INSERT INTO residence_unit VALUES (105, 'ward', 3, 550.00);
INSERT INTO residence_unit VALUES (106, 'cabin', 4, 1600.00);
INSERT INTO residence_unit VALUES (107, 'ward', 5, 600.00);
INSERT INTO residence_unit VALUES (108, 'icu', 2, 5500.00);
INSERT INTO residence_unit VALUES (109, 'cabin', 5, 1700.00);
INSERT INTO residence_unit VALUES (110, 'ward', 2, 520.00);


-- Resident Patients
INSERT INTO resident_patient VALUES (18, 103, 'cabin', 2, 5, 7500.00); -- Patient 18 (Hridoy Hossain), Neurology, Cabin, 5 days
INSERT INTO resident_patient VALUES (21, 104, 'icu', 1, 3, 15000.00); -- Patient 21 (Morshed Alam), Cardiology, ICU, 3 days
INSERT INTO resident_patient VALUES (24, 101, 'ward', 1, 7, 3500.00); -- Patient 24 (Alifa Mahmud), Cardiology, Ward, 7 days
INSERT INTO resident_patient VALUES (27, 106, 'cabin', 4, 4, 6400.00); -- Patient 27 (Sajib Chowdhury), Pediatrics, Cabin, 4 days
INSERT INTO resident_patient VALUES (30, 107, 'ward', 5, 2, 1200.00); -- Patient 30 (Adnan Zaman), Oncology, Ward, 2 days


-- Appointments
INSERT INTO appointment VALUES (1, 16, 6, '2025-06-16', 304);
INSERT INTO appointment VALUES (2, 17, 7, '2025-05-28', 827);
INSERT INTO appointment VALUES (3, 18, 7, '2025-05-24', 827);
INSERT INTO appointment VALUES (4, 19, 8, '2025-06-15', 750);
INSERT INTO appointment VALUES (5, 20, 5, '2025-06-14', 600);
INSERT INTO appointment VALUES (6, 16, 4, '2025-06-13', 320);
INSERT INTO appointment VALUES (7, 22, 6, '2025-06-12', 800);
INSERT INTO appointment VALUES (8, 23, 7, '2025-06-11', 850);
INSERT INTO appointment VALUES (9, 25, 4, '2025-06-10', 310);
INSERT INTO appointment VALUES (10, 26, 5, '2025-06-09', 620);
INSERT INTO appointment VALUES (11, 28, 8, '2025-06-08', 780);
INSERT INTO appointment VALUES (12, 29, 6, '2025-06-07', 810);
INSERT INTO appointment VALUES (13, 17, 7, '2025-06-06', 830);
INSERT INTO appointment VALUES (14, 19, 5, '2025-06-05', 610);
INSERT INTO appointment VALUES (15, 20, 4, '2025-06-04', 330);


-- Prescriptions
INSERT INTO prescription VALUES (1, 1, '2025-06-21');
INSERT INTO prescription VALUES (2, 2, '2025-06-20');
INSERT INTO prescription VALUES (3, 3, '2025-06-19');
INSERT INTO prescription VALUES (4, 4, '2025-06-20');
INSERT INTO prescription VALUES (5, 5, '2025-06-19');
INSERT INTO prescription VALUES (6, 6, '2025-06-18');
INSERT INTO prescription VALUES (7, 7, '2025-06-17');
INSERT INTO prescription VALUES (8, 8, '2025-06-16');
INSERT INTO prescription VALUES (9, 9, '2025-06-15');
INSERT INTO prescription VALUES (10, 10, '2025-06-14');
INSERT INTO prescription VALUES (11, 11, '2025-06-13');
INSERT INTO prescription VALUES (12, 12, '2025-06-12');
INSERT INTO prescription VALUES (13, 13, '2025-06-11');
INSERT INTO prescription VALUES (14, 14, '2025-06-10');
INSERT INTO prescription VALUES (15, 15, '2025-06-09');


-- Tests
INSERT INTO test VALUES (1, 'LFT', 1, 2019, '2025-06-18');
INSERT INTO test VALUES (2, 'Ultrasound', 2, 828, '2025-06-19');
INSERT INTO test VALUES (3, 'LFT', 3, 933, '2025-06-20');
INSERT INTO test VALUES (4, 'X-ray', 4, 500, '2025-06-17');
INSERT INTO test VALUES (5, 'Blood Sugar', 5, 300, '2025-06-18');
INSERT INTO test VALUES (6, 'ECG', 6, 700, '2025-06-19');
INSERT INTO test VALUES (7, 'CT Scan', 7, 2500, '2025-06-20');
INSERT INTO test VALUES (8, 'Urine Test', 8, 250, '2025-06-21');
INSERT INTO test VALUES (9, 'MRI', 9, 4000, '2025-06-22');
INSERT INTO test VALUES (10, 'Kidney Function Test', 10, 600, '2025-06-23');
INSERT INTO test VALUES (11, 'Thyroid Panel', 11, 750, '2025-06-24');
INSERT INTO test VALUES (12, 'Liver Function Test', 12, 900, '2025-06-25');
INSERT INTO test VALUES (13, 'Echo Cardiogram', 13, 1200, '2025-06-26');
INSERT INTO test VALUES (14, 'Endoscopy', 14, 1800, '2025-06-27');
INSERT INTO test VALUES (15, 'Colonoscopy', 15, 2000, '2025-06-28');
INSERT INTO test VALUES (16, 'Blood Pressure Check', 1, 100, '2025-06-17');
INSERT INTO test VALUES (17, 'Cholesterol Test', 2, 400, '2025-06-18');
INSERT INTO test VALUES (18, 'Vitamin D Test', 3, 800, '2025-06-19');
INSERT INTO test VALUES (19, 'Hepatitis Panel', 4, 1500, '2025-06-20');
INSERT INTO test VALUES (20, 'Allergy Test', 5, 900, '2025-06-21');
INSERT INTO test VALUES (21, 'Bone Density Scan', 6, 1000, '2025-06-22');
INSERT INTO test VALUES (22, 'Pulmonary Function Test', 7, 1100, '2025-06-23');
INSERT INTO test VALUES (23, 'Sleep Study', 8, 3000, '2025-06-24');
INSERT INTO test VALUES (24, 'Genetic Testing', 9, 5000, '2025-06-25');
INSERT INTO test VALUES (25, 'Eye Exam', 10, 200, '2025-06-26');
INSERT INTO test VALUES (26, 'Hearing Test', 11, 200, '2025-06-27');
INSERT INTO test VALUES (27, 'Dental Check-up', 12, 300, '2025-06-28');
INSERT INTO test VALUES (28, 'Stress Test', 13, 1500, '2025-06-29');
INSERT INTO test VALUES (29, 'Biopsy', 14, 2500, '2025-06-30');
INSERT INTO test VALUES (30, 'Mammogram', 15, 1000, '2025-07-01');
INSERT INTO test VALUES (31, 'Blood Culture', 1, 600, '2025-07-02');
INSERT INTO test VALUES (32, 'Stool Test', 2, 350, '2025-07-03');
INSERT INTO test VALUES (33, 'Throat Swab', 3, 250, '2025-07-04');
INSERT INTO test VALUES (34, 'Spirometry', 4, 450, '2025-07-05');
INSERT INTO test VALUES (35, 'Pap Smear', 5, 700, '2025-07-06');


-- Drugs
INSERT INTO drug VALUES (1, 'Paracetamol', 35);
INSERT INTO drug VALUES (2, 'Amoxicillin', 24);
INSERT INTO drug VALUES (3, 'Metformin', 47);
INSERT INTO drug VALUES (4, 'Omeprazole', 28);
INSERT INTO drug VALUES (5, 'Atorvastatin', 65);
INSERT INTO drug VALUES (6, 'Ciprofloxacin', 32);
INSERT INTO drug VALUES (7, 'Lisinopril', 40);
INSERT INTO drug VALUES (8, 'Sertraline', 55);
INSERT INTO drug VALUES (9, 'Ibuprofen', 15);
INSERT INTO drug VALUES (10, 'Amlodipine', 38);
INSERT INTO drug VALUES (11, 'Gabapentin', 42);
INSERT INTO drug VALUES (12, 'Levothyroxine', 20);
INSERT INTO drug VALUES (13, 'Prednisone', 30);
INSERT INTO drug VALUES (14, 'Tramadol', 25);
INSERT INTO drug VALUES (15, 'Ventolin', 50);


-- Diagnoses (Populate based on existing tests)
INSERT INTO diagnosis (test_id, result) VALUES (1, 'Normal liver function');
INSERT INTO diagnosis (test_id, result) VALUES (2, 'Gallstones detected');
INSERT INTO diagnosis (test_id, result) VALUES (3, 'Mild elevated liver enzymes');
INSERT INTO diagnosis (test_id, result) VALUES (4, 'No fractures');
INSERT INTO diagnosis (test_id, result) VALUES (5, 'Blood sugar within normal limits');
INSERT INTO diagnosis (test_id, result) VALUES (6, 'Normal heart rhythm');
INSERT INTO diagnosis (test_id, result) VALUES (7, 'No abnormalities found');
INSERT INTO diagnosis (test_id, result) VALUES (8, 'UTI negative');
INSERT INTO diagnosis (test_id, result) VALUES (9, 'Herniated disc detected');
INSERT INTO diagnosis (test_id, result) VALUES (10, 'Kidney function normal');
INSERT INTO diagnosis (test_id, result) VALUES (11, 'Thyroid levels balanced');
INSERT INTO diagnosis (test_id, result) VALUES (12, 'Normal liver function');
INSERT INTO diagnosis (test_id, result) VALUES (13, 'Normal cardiac structure');
INSERT INTO diagnosis (test_id, result) VALUES (14, 'Gastric ulcer found');
INSERT INTO diagnosis (test_id, result) VALUES (15, 'Polyps detected, requiring further investigation');
INSERT INTO diagnosis (test_id, result) VALUES (16, 'BP normal');
INSERT INTO diagnosis (test_id, result) VALUES (17, 'High cholesterol');
INSERT INTO diagnosis (test_id, result) VALUES (18, 'Vitamin D deficiency');
INSERT INTO diagnosis (test_id, result) VALUES (19, 'Hepatitis B positive');
INSERT INTO diagnosis (test_id, result) VALUES (20, 'Dust mite allergy');


-- Treatments (Populate based on diagnoses)
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (1, 'No specific treatment required', 0);
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (2, 'Surgical removal of gallstones', 150000);
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (3, 'Medication for liver support', 5000);
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (4, 'Physical therapy', 3000);
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (5, 'Dietary advice', 200);
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (6, 'Monitoring', 0);
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (7, 'Observation', 0);
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (8, 'No treatment needed', 0);
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (9, 'Physiotherapy and pain management', 7000);
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (10, 'Continue current medication', 0);
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (11, 'No treatment required', 0);
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (12, 'Lifestyle changes recommended', 0);
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (13, 'Regular check-ups', 0);
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (14, 'Medication for ulcer healing', 4000);
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (15, 'Polypectomy procedure', 25000);
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (16, 'Lifestyle modification', 0);
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (17, 'Prescribed statins', 1500);
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (18, 'Vitamin D supplements', 1000);
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (19, 'Antiviral medication', 10000);
INSERT INTO treatment (diagnosis_id, treatment_type, treatment_cost) VALUES (20, 'Antihistamines', 500);


-- Buys (Patient purchases drugs)
INSERT INTO buys VALUES (16, 1, 2, '2025-06-22'); -- Arifuzzaman buys 2 Paracetamol
INSERT INTO buys VALUES (17, 4, 1, '2025-06-21'); -- Sumaiya Sultana buys 1 Omeprazole
INSERT INTO buys VALUES (18, 9, 3, '2025-06-20'); -- Hridoy Hossain buys 3 Ibuprofen
INSERT INTO buys VALUES (19, 2, 1, '2025-06-19'); -- Nazmul Kabir buys 1 Amoxicillin
INSERT INTO buys VALUES (20, 5, 2, '2025-06-18'); -- Tania Rahman buys 2 Atorvastatin
INSERT INTO buys VALUES (21, 6, 1, '2025-06-17'); -- Morshed Alam buys 1 Ciprofloxacin
INSERT INTO buys VALUES (22, 1, 1, '2025-06-16'); -- Rumana Parvin buys 1 Paracetamol
INSERT INTO buys VALUES (23, 7, 2, '2025-06-15'); -- Touhidul Islam buys 2 Lisinopril
INSERT INTO buys VALUES (24, 3, 1, '2025-06-14'); -- Alifa Mahmud buys 1 Metformin
INSERT INTO buys VALUES (25, 8, 1, '2025-06-13'); -- Khaled Hasan buys 1 Sertraline
INSERT INTO buys VALUES (26, 10, 2, '2025-06-12'); -- Rizwana Khan buys 2 Amlodipine
INSERT INTO buys VALUES (27, 11, 1, '2025-06-11'); -- Sajib Chowdhury buys 1 Gabapentin
INSERT INTO buys VALUES (28, 12, 1, '2025-06-10'); -- Maruf Mahmud buys 1 Levothyroxine
INSERT INTO buys VALUES (29, 13, 2, '2025-06-09'); -- Labiba Islam buys 2 Prednisone
INSERT INTO buys VALUES (30, 14, 1, '2025-06-08'); -- Adnan Zaman buys 1 Tramadol


-- Bills (Populate with calculated charges based on appointments, tests, residence, treatments, and drugs)
-- For simplicity, let's assume some charges for now, and you can calculate precise totals in your application logic.
-- cashier_id: using dummy cashier (45) and existing cashiers (13, 14, 15)
INSERT INTO bill (patient_id, cashier_id, test_charge, medicine_charge, appointment_charge, residence_charge, treatment_charge, total_charge)
VALUES (16, 13, 2019 + 100, (35*2), 304, 0, 0, 2019 + 100 + (35*2) + 304); -- Patient 16: LFT (2019), BP Check (100), Paracetamol (70), Appt (304)
INSERT INTO bill (patient_id, cashier_id, test_charge, medicine_charge, appointment_charge, residence_charge, treatment_charge, total_charge)
VALUES (17, 14, 828 + 400, (28*1) + (830/24), 827 + 830, 0, 0, 828 + 400 + (28*1) + (830/24) + 827 + 830); -- Patient 17: Ultrasound (828), Cholesterol (400), Omeprazole (28), Appt (827, 830)
INSERT INTO bill (patient_id, cashier_id, test_charge, medicine_charge, appointment_charge, residence_charge, treatment_charge, total_charge)
VALUES (18, 15, 933 + 800, (15*3), 827, 7500, 150000, 933 + 800 + (15*3) + 827 + 7500 + 150000); -- Patient 18: LFT (933), Vitamin D (800), Ibuprofen (45), Appt (827), Residence (7500), Treatment (150000)
INSERT INTO bill (patient_id, cashier_id, test_charge, medicine_charge, appointment_charge, residence_charge, treatment_charge, total_charge)
VALUES (19, 13, 500 + 1500, (24*1), 750 + 610, 0, 0, 500 + 1500 + (24*1) + 750 + 610); -- Patient 19: X-ray (500), Hepatitis (1500), Amoxicillin (24), Appt (750, 610)
INSERT INTO bill (patient_id, cashier_id, test_charge, medicine_charge, appointment_charge, residence_charge, treatment_charge, total_charge)
VALUES (20, 14, 300 + 900, (65*2), 600 + 330, 0, 0, 300 + 900 + (65*2) + 600 + 330); -- Patient 20: Blood Sugar (300), Allergy (900), Atorvastatin (130), Appt (600, 330)
INSERT INTO bill (patient_id, cashier_id, test_charge, medicine_charge, appointment_charge, residence_charge, treatment_charge, total_charge)
VALUES (21, 15, 700 + 1000, (32*1), 0, 15000, 0, 700 + 1000 + (32*1) + 15000); -- Patient 21: ECG (700), Bone Density (1000), Ciprofloxacin (32), Residence (15000)
INSERT INTO bill (patient_id, cashier_id, test_charge, medicine_charge, appointment_charge, residence_charge, treatment_charge, total_charge)
VALUES (22, 45, 2500 + 1100, (35*1), 800, 0, 0, 2500 + 1100 + (35*1) + 800); -- Patient 22: CT Scan (2500), Pulmonary (1100), Paracetamol (35), Appt (800)
INSERT INTO bill (patient_id, cashier_id, test_charge, medicine_charge, appointment_charge, residence_charge, treatment_charge, total_charge)
VALUES (23, 13, 250 + 3000, (40*2), 850, 0, 0, 250 + 3000 + (40*2) + 850); -- Patient 23: Urine Test (250), Sleep Study (3000), Lisinopril (80), Appt (850)
INSERT INTO bill (patient_id, cashier_id, test_charge, medicine_charge, appointment_charge, residence_charge, treatment_charge, total_charge)
VALUES (24, 14, 4000 + 5000, (47*1), 0, 3500, 0, 4000 + 5000 + (47*1) + 3500); -- Patient 24: MRI (4000), Genetic Testing (5000), Metformin (47), Residence (3500)
INSERT INTO bill (patient_id, cashier_id, test_charge, medicine_charge, appointment_charge, residence_charge, treatment_charge, total_charge)
VALUES (25, 15, 600 + 200, (55*1), 310, 0, 0, 600 + 200 + (55*1) + 310); -- Patient 25: Kidney Function (600), Eye Exam (200), Sertraline (55), Appt (310)


-- Hospital Records
INSERT INTO hospital_record (patient_id, bill_id, admission_date, discharge_date, disease)
VALUES (16, 1, '2025-06-15', '2025-06-22', 'Common Cold');
INSERT INTO hospital_record (patient_id, bill_id, admission_date, discharge_date, disease)
VALUES (17, 2, '2025-05-27', '2025-06-21', 'Gastric Ulcer');
INSERT INTO hospital_record (patient_id, bill_id, admission_date, discharge_date, disease)
VALUES (18, 3, '2025-05-23', '2025-06-20', 'Herniated Disc');
INSERT INTO hospital_record (patient_id, bill_id, admission_date, discharge_date, disease)
VALUES (19, 4, '2025-06-14', '2025-06-20', 'Bacterial Infection');
INSERT INTO hospital_record (patient_id, bill_id, admission_date, discharge_date, disease)
VALUES (20, 5, '2025-06-13', '2025-06-19', 'High Cholesterol');
INSERT INTO hospital_record (patient_id, bill_id, admission_date, discharge_date, disease)
VALUES (21, 6, '2025-06-16', '2025-06-17', 'Cardiac Arrhythmia');
INSERT INTO hospital_record (patient_id, bill_id, admission_date, discharge_date, disease)
VALUES (22, 7, '2025-06-11', '2025-06-17', 'Bronchitis');
INSERT INTO hospital_record (patient_id, bill_id, admission_date, discharge_date, disease)
VALUES (23, 8, '2025-06-10', '2025-06-16', 'Hypertension');
INSERT INTO hospital_record (patient_id, bill_id, admission_date, discharge_date, disease)
VALUES (24, 9, '2025-06-13', '2025-06-15', 'Diabetes Mellitus');
INSERT INTO hospital_record (patient_id, bill_id, admission_date, discharge_date, disease)
VALUES (25, 10, '2025-06-09', '2025-06-13', 'Anxiety Disorder');



-- Add missing bills for patients 26, 27, 28, 29, 30
INSERT INTO bill (patient_id, cashier_id, test_charge, medicine_charge, appointment_charge, residence_charge, treatment_charge, total_charge)
VALUES (26, 13, 750 + 200, (38*2), 620, 0, 0, 750 + 200 + (38*2) + 620); -- Patient 26

INSERT INTO bill (patient_id, cashier_id, test_charge, medicine_charge, appointment_charge, residence_charge, treatment_charge, total_charge)
VALUES (27, 14, 900 + 300, (42*1), 0, 6400, 0, 900 + 300 + (42*1) + 6400); -- Patient 27

INSERT INTO bill (patient_id, cashier_id, test_charge, medicine_charge, appointment_charge, residence_charge, treatment_charge, total_charge)
VALUES (28, 15, 1200 + 1500, (20*1), 780, 0, 0, 1200 + 1500 + (20*1) + 780); -- Patient 28

INSERT INTO bill (patient_id, cashier_id, test_charge, medicine_charge, appointment_charge, residence_charge, treatment_charge, total_charge)
VALUES (29, 45, 1800 + 2500, (30*2), 810, 0, 0, 1800 + 2500 + (30*2) + 810); -- Patient 29

INSERT INTO bill (patient_id, cashier_id, test_charge, medicine_charge, appointment_charge, residence_charge, treatment_charge, total_charge)
VALUES (30, 13, 2000 + 1000, (25*1), 0, 1200, 0, 2000 + 1000 + (25*1) + 1200); -- Patient 30



-- Then insert correct records
INSERT INTO hospital_record (patient_id, bill_id, admission_date, discharge_date, disease)
VALUES (27, (SELECT bill_id FROM bill WHERE patient_id = 27), '2025-06-10', '2025-06-11', 'Pneumonia');

INSERT INTO hospital_record (patient_id, bill_id, admission_date, discharge_date, disease)
VALUES (30, (SELECT bill_id FROM bill WHERE patient_id = 30), '2025-06-07', '2025-06-08', 'Fatigue');


-- Drop existing default if any
ALTER TABLE public.test
ALTER COLUMN test_id DROP DEFAULT;

-- Drop existing identity if partially set
ALTER TABLE public.test
ALTER COLUMN test_id DROP IDENTITY IF EXISTS;

-- Make test_id auto-increment
ALTER TABLE public.test
ALTER COLUMN test_id ADD GENERATED ALWAYS AS IDENTITY;

-- Reset the identity sequence to avoid conflict (99 is your current max test_id)
ALTER TABLE public.test
ALTER COLUMN test_id RESTART WITH 100;



CREATE TABLE insertion_log (
    id SERIAL PRIMARY KEY,  
    entity_type VARCHAR(20),
    inserted_entity_name VARCHAR(100),
    inserted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    admin_id INT,
    admin_name VARCHAR(100),
    admin_email VARCHAR(100)
);

CREATE TABLE deletion_log (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(20),
  deleted_entity_name VARCHAR(50),
  admin_id INT,
  admin_name VARCHAR(50),
  admin_email VARCHAR(50),
  deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE updating_log (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employee(employee_id) ON DELETE CASCADE,
    employee_type VARCHAR(20) NOT NULL CHECK (employee_type IN ('doctor', 'nurse', 'cashier')),
    old_salary INT,
    new_salary INT,
    updated_by_admin_id INT,
    updated_by_admin_name VARCHAR(100),
    updated_by_admin_email VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





CREATE OR REPLACE FUNCTION add_hospital_record(
    p_patient_id INT,
    p_admission_date DATE,
    p_discharge_date DATE,
    p_disease VARCHAR
)
RETURNS TEXT AS $$
DECLARE
    v_bill_id INT;
BEGIN
    -- Get the latest bill for the patient
    SELECT bill_id INTO v_bill_id
    FROM bill
    WHERE patient_id = p_patient_id
    ORDER BY bill_id DESC
    LIMIT 1;

    IF v_bill_id IS NULL THEN
        RETURN 'Error: No bill found for this patient. Cannot add hospital record.';
    END IF;

    INSERT INTO hospital_record(patient_id, bill_id, admission_date, discharge_date, disease)
    VALUES (p_patient_id, v_bill_id, p_admission_date, p_discharge_date, p_disease);

    RETURN 'Hospital record added successfully.';
END;
$$ LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION view_hospital_record(p_patient_id INT)
RETURNS TABLE (
    record_id INT,
    admission_date DATE,
    discharge_date DATE,
    disease VARCHAR,
    total_charge DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT hr.record_id, hr.admission_date, hr.discharge_date, hr.disease, b.total_charge
    FROM hospital_record hr
    JOIN bill b ON hr.bill_id = b.bill_id
    WHERE hr.patient_id = p_patient_id
    ORDER BY hr.admission_date DESC;
END;
$$ LANGUAGE plpgsql;
