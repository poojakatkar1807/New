const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/patients
router.get('/patients', (req, res) => {
  res.json({ success: true, data: store.patients });
});

// GET /api/patients/:id
router.get('/patients/:id', (req, res) => {
  const patient = store.patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ success: false, error: 'Patient not found' });
  res.json({ success: true, data: patient });
});

// POST /api/patients
router.post('/patients', (req, res) => {
  const { firstName, lastName, age, gender, phone } = req.body;
  if (!firstName || !lastName || !gender || !phone) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  const newPatient = {
    id: `P-${store.nextPatientId++}`,
    firstName, lastName, age: parseInt(age) || 0, gender, phone,
    email: req.body.email || '', dob: req.body.dob || '',
    bloodGroup: req.body.bloodGroup || 'Unknown',
    address: req.body.address || '',
    emergencyContact: req.body.emergencyContact || '',
    status: 'Active',
    registeredDate: new Date().toISOString().split('T')[0]
  };
  store.patients.push(newPatient);
  res.status(201).json({ success: true, data: newPatient });
});

// DELETE /api/patients/:id
router.delete('/patients/:id', (req, res) => {
  const index = store.patients.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Patient not found' });
  store.patients.splice(index, 1);
  res.json({ success: true, message: 'Patient deleted' });
});

// GET /api/appointments
router.get('/appointments', (req, res) => {
  res.json({ success: true, data: store.appointments });
});

// POST /api/appointments
router.post('/appointments', (req, res) => {
  const { patientId, date, time, type } = req.body;
  if (!patientId || !date || !time || !type) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  const patient = store.patients.find(p => p.id === patientId);
  if (!patient) return res.status(404).json({ success: false, error: 'Patient not found' });

  const newAppt = {
    id: store.nextAppointmentId++,
    patientId, patientName: `${patient.firstName} ${patient.lastName}`,
    doctor: req.body.doctor || 'Dr. Sarah Johnson',
    date, time, type, status: 'Scheduled', notes: req.body.notes || ''
  };
  store.appointments.push(newAppt);
  res.status(201).json({ success: true, data: newAppt });
});

// GET /api/vitals/:patientId
router.get('/vitals/:patientId', (req, res) => {
  const vitals = store.vitals.filter(v => v.patientId === req.params.patientId);
  res.json({ success: true, data: vitals });
});

// POST /api/vitals
router.post('/vitals', (req, res) => {
  const { patientId, bp, heartRate } = req.body;
  if (!patientId || !bp || !heartRate) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  const newVital = {
    id: store.nextVitalId++, patientId,
    date: new Date().toISOString().split('T')[0],
    bp, heartRate: parseInt(heartRate),
    temp: parseFloat(req.body.temp) || 98.6,
    weight: parseFloat(req.body.weight) || 0,
    height: parseFloat(req.body.height) || 0,
    spo2: parseInt(req.body.spo2) || 0,
    notes: req.body.notes || ''
  };
  store.vitals.push(newVital);
  res.status(201).json({ success: true, data: newVital });
});

module.exports = router;
