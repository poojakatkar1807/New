const express = require('express');
const router = express.Router();
const store = require('../data/store');

// POST /vitals — record new vitals
router.post('/', (req, res) => {
  const { patientId, bp, heartRate, temp, weight, height, spo2, notes } = req.body;

  if (!patientId || !bp || !heartRate) {
    return res.redirect(`/patients/${patientId}?error=Please fill required vitals fields`);
  }

  const newVital = {
    id: store.nextVitalId++,
    patientId,
    date: new Date().toISOString().split('T')[0],
    bp,
    heartRate: parseInt(heartRate),
    temp: parseFloat(temp) || 98.6,
    weight: parseFloat(weight) || 0,
    height: parseFloat(height) || 0,
    spo2: parseInt(spo2) || 0,
    notes: notes || ''
  };

  store.vitals.push(newVital);
  res.redirect(`/patients/${patientId}?success=Vitals recorded successfully`);
});

module.exports = router;
