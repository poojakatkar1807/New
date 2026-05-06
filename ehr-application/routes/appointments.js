const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /appointments — list all
router.get('/', (req, res) => {
  const statusFilter = req.query.status || 'all';
  let appointments = [...store.appointments];
  if (statusFilter !== 'all') {
    appointments = appointments.filter(a => a.status === statusFilter);
  }
  res.render('pages/appointments', { appointments, statusFilter, patients: store.patients, error: null, success: null });
});

// POST /appointments — schedule new
router.post('/', (req, res) => {
  const { patientId, doctor, date, time, type, notes } = req.body;

  if (!patientId || !date || !time || !type) {
    const appointments = [...store.appointments];
    return res.render('pages/appointments', { appointments, statusFilter: 'all', patients: store.patients, error: 'Please fill all required fields', success: null });
  }

  const patient = store.patients.find(p => p.id === patientId);
  if (!patient) {
    const appointments = [...store.appointments];
    return res.render('pages/appointments', { appointments, statusFilter: 'all', patients: store.patients, error: 'Patient not found', success: null });
  }

  const newAppointment = {
    id: store.nextAppointmentId++,
    patientId,
    patientName: `${patient.firstName} ${patient.lastName}`,
    doctor: doctor || 'Dr. Sarah Johnson',
    date, time, type,
    status: 'Scheduled',
    notes: notes || ''
  };

  store.appointments.push(newAppointment);
  const appointments = [...store.appointments];
  res.render('pages/appointments', { appointments, statusFilter: 'all', patients: store.patients, error: null, success: `Appointment scheduled for ${newAppointment.patientName} on ${date} at ${time}` });
});

// POST /appointments/:id/cancel
router.post('/:id/cancel', (req, res) => {
  const appt = store.appointments.find(a => a.id === parseInt(req.params.id));
  if (appt) appt.status = 'Cancelled';
  res.redirect('/appointments');
});

// POST /appointments/:id/complete
router.post('/:id/complete', (req, res) => {
  const appt = store.appointments.find(a => a.id === parseInt(req.params.id));
  if (appt) appt.status = 'Completed';
  res.redirect('/appointments');
});

module.exports = router;
