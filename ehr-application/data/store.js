// In-memory data store for the EHR application
// Resets on server restart — no database needed

const store = {

  users: [
    { id: 1, username: 'doctor', password: 'Doctor@123', role: 'doctor', name: 'Dr. Sarah Johnson' },
    { id: 2, username: 'nurse', password: 'Nurse@123', role: 'nurse', name: 'Nurse Emily Davis' },
    { id: 3, username: 'admin', password: 'Admin@123', role: 'admin', name: 'Admin User' }
  ],

  patients: [
    {
      id: 'P-1001', firstName: 'Rajesh', lastName: 'Kumar', age: 45, gender: 'Male',
      dob: '1981-03-15', phone: '9876543210', email: 'rajesh.kumar@email.com',
      bloodGroup: 'B+', address: '123 MG Road, Pune',
      emergencyContact: 'Priya Kumar - 9876543211',
      status: 'Active', registeredDate: '2025-01-10'
    },
    {
      id: 'P-1002', firstName: 'Anita', lastName: 'Sharma', age: 32, gender: 'Female',
      dob: '1994-07-22', phone: '9123456789', email: 'anita.sharma@email.com',
      bloodGroup: 'O+', address: '456 Park Street, Mumbai',
      emergencyContact: 'Vikram Sharma - 9123456790',
      status: 'Active', registeredDate: '2025-02-14'
    },
    {
      id: 'P-1003', firstName: 'Mohammed', lastName: 'Ali', age: 58, gender: 'Male',
      dob: '1968-11-05', phone: '9988776655', email: 'mohammed.ali@email.com',
      bloodGroup: 'A-', address: '789 Lake View, Bangalore',
      emergencyContact: 'Fatima Ali - 9988776656',
      status: 'Active', registeredDate: '2025-03-01'
    }
  ],

  vitals: [
    { id: 1, patientId: 'P-1001', date: '2025-06-01', bp: '130/85', heartRate: 78, temp: 98.6, weight: 72, height: 170, spo2: 97, notes: 'Slightly elevated BP' },
    { id: 2, patientId: 'P-1001', date: '2025-07-15', bp: '125/80', heartRate: 75, temp: 98.4, weight: 71, height: 170, spo2: 98, notes: 'BP improving' },
    { id: 3, patientId: 'P-1002', date: '2025-06-10', bp: '118/76', heartRate: 72, temp: 98.2, weight: 58, height: 162, spo2: 99, notes: 'Normal vitals' },
    { id: 4, patientId: 'P-1003', date: '2025-06-20', bp: '145/92', heartRate: 82, temp: 98.8, weight: 85, height: 175, spo2: 96, notes: 'High BP - monitor closely' }
  ],

  appointments: [
    { id: 1, patientId: 'P-1001', patientName: 'Rajesh Kumar', doctor: 'Dr. Sarah Johnson', date: '2026-04-20', time: '10:00', type: 'Follow-up', status: 'Scheduled', notes: 'BP check follow-up' },
    { id: 2, patientId: 'P-1002', patientName: 'Anita Sharma', doctor: 'Dr. Sarah Johnson', date: '2026-04-21', time: '11:30', type: 'Consultation', status: 'Scheduled', notes: 'Annual checkup' },
    { id: 3, patientId: 'P-1003', patientName: 'Mohammed Ali', doctor: 'Dr. Sarah Johnson', date: '2026-04-18', time: '09:00', type: 'Follow-up', status: 'Completed', notes: 'Diabetes review' }
  ],

  prescriptions: [
    { id: 1, patientId: 'P-1001', date: '2025-07-15', doctor: 'Dr. Sarah Johnson', medications: [
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' },
      { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '30 days' }
    ], notes: 'Take with food. Follow up in 1 month.' },
    { id: 2, patientId: 'P-1002', date: '2025-06-10', doctor: 'Dr. Sarah Johnson', medications: [
      { name: 'Vitamin D3', dosage: '60000IU', frequency: 'Once weekly', duration: '8 weeks' }
    ], notes: 'Take after meals.' },
    { id: 3, patientId: 'P-1003', date: '2025-06-20', doctor: 'Dr. Sarah Johnson', medications: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '90 days' },
      { name: 'Losartan', dosage: '50mg', frequency: 'Once daily', duration: '90 days' }
    ], notes: 'Monitor blood sugar regularly.' }
  ],

  nextPatientId: 1004,
  nextVitalId: 5,
  nextAppointmentId: 4,
  nextPrescriptionId: 4
};

module.exports = store;
