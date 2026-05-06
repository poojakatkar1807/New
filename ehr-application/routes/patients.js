const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /patients — list all patients
router.get('/', (req, res) => {
  let patients = [...store.patients];
  const search = req.query.search || '';
  if (search) {
    const q = search.toLowerCase();
    patients = patients.filter(p =>
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.phone.includes(q)
    );
  }
  res.render('pages/patients', { patients, search });
});

// GET /patients/register — registration form
router.get('/register', (req, res) => {
  res.render('pages/patient-register', { error: null, success: null });
});

// POST /patients/register — create patient
router.post('/register', (req, res) => {
  const { firstName, lastName, age, gender, dob, phone, email, bloodGroup, address, emergencyContact } = req.body;

  if (!firstName || !lastName || !gender || !phone) {
    return res.render('pages/patient-register', { error: 'Please fill all required fields', success: null });
  }

  const newPatient = {
    id: `P-${store.nextPatientId++}`,
    firstName, lastName,
    age: parseInt(age) || 0,
    gender, dob, phone, email,
    bloodGroup: bloodGroup || 'Unknown',
    address: address || '',
    emergencyContact: emergencyContact || '',
    status: 'Active',
    registeredDate: new Date().toISOString().split('T')[0]
  };

  store.patients.push(newPatient);
  res.render('pages/patient-register', { error: null, success: `Patient ${newPatient.firstName} ${newPatient.lastName} registered successfully (ID: ${newPatient.id})` });
});

// GET /patients/:id — patient details
router.get('/:id', (req, res) => {
  const patient = store.patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).render('pages/error', { message: 'Patient not found' });

  const vitals = store.vitals.filter(v => v.patientId === patient.id);
  const appointments = store.appointments.filter(a => a.patientId === patient.id);
  const prescriptions = store.prescriptions.filter(p => p.patientId === patient.id);

  res.render('pages/patient-detail', { patient, vitals, appointments, prescriptions });
});

module.exports = router;
