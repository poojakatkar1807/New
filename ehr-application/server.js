const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const appointmentRoutes = require('./routes/appointments');
const vitalRoutes = require('./routes/vitals');
const prescriptionRoutes = require('./routes/prescriptions');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'ehr-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
}));

// Make user available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Auth middleware
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

// Routes
app.use('/', authRoutes);
app.use('/patients', requireAuth, patientRoutes);
app.use('/appointments', requireAuth, appointmentRoutes);
app.use('/vitals', requireAuth, vitalRoutes);
app.use('/prescriptions', requireAuth, prescriptionRoutes);
app.use('/api', apiRoutes);

// Dashboard
app.get('/dashboard', requireAuth, (req, res) => {
  const store = require('./data/store');
  const stats = {
    totalPatients: store.patients.length,
    todayAppointments: store.appointments.filter(a => a.status === 'Scheduled').length,
    completedAppointments: store.appointments.filter(a => a.status === 'Completed').length,
    totalPrescriptions: store.prescriptions.length
  };
  res.render('pages/dashboard', { stats, recentPatients: store.patients.slice(0, 5), upcomingAppointments: store.appointments.filter(a => a.status === 'Scheduled').slice(0, 5) });
});

// Home redirect
app.get('/', (req, res) => {
  res.redirect(req.session.user ? '/dashboard' : '/login');
});

app.listen(PORT, () => {
  console.log(`EHR Application running at http://localhost:${PORT}`);
});

module.exports = app;
