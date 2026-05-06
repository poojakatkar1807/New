const express = require('express');
const router = express.Router();
const store = require('../data/store');

// POST /prescriptions — add new prescription
router.post('/', (req, res) => {
  const { patientId, medName, dosage, frequency, duration, notes } = req.body;

  if (!patientId || !medName || !dosage) {
    return res.redirect(`/patients/${patientId}?error=Please fill required prescription fields`);
  }

  const newPrescription = {
    id: store.nextPrescriptionId++,
    patientId,
    date: new Date().toISOString().split('T')[0],
    doctor: req.session.user ? req.session.user.name : 'Dr. Sarah Johnson',
    medications: [{ name: medName, dosage, frequency: frequency || 'Once daily', duration: duration || '30 days' }],
    notes: notes || ''
  };

  store.prescriptions.push(newPrescription);
  res.redirect(`/patients/${patientId}?success=Prescription added successfully`);
});

module.exports = router;
