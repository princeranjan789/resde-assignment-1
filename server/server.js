const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clinical-dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Models
const patientSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  appointmentStatus: { type: String, enum: ['Pending', 'Confirmed', 'Completed'], required: true },
  clinicalNotes: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const auditLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  action: { type: String, enum: ['READ', 'CREATE'], required: true },
  patientId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Patient = mongoose.model('Patient', patientSchema);
const AuditLog = mongoose.model('AuditLog', auditLogSchema);

// Middleware for RBAC
const checkRole = (requiredRole) => (req, res, next) => {
  const role = req.headers['role'];
  if (role !== requiredRole) {
    return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
  }
  next();
};

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Clinical Appointment Dashboard API is running' });
});

// Routes
app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    // Log access
    const userId = req.headers['userid'] || 'anonymous';
    for (const patient of patients) {
      await AuditLog.create({ userId, action: 'READ', patientId: patient.id });
    }
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

app.get('/patients/:id', checkRole('DOCTOR'), async (req, res) => {
  try {
    const patient = await Patient.findOne({ id: req.params.id });
    if (!patient) {
      return res.status(404).json({
        error: 'We could not locate that patient record right now. Please verify the patient ID or return to the dashboard to continue your ward round with confidence.',
      });
    }
    // Log access
    const userId = req.headers['userid'] || 'anonymous';
    await AuditLog.create({ userId, action: 'READ', patientId: patient.id });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

app.post('/patients', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    // Log creation
    const userId = req.headers['userid'] || 'anonymous';
    await AuditLog.create({ userId, action: 'CREATE', patientId: patient.id });
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create patient' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Seed data
const seedData = async () => {
  const count = await Patient.countDocuments();
  if (count === 0) {
    await Patient.insertMany([
      {
        id: '1',
        name: 'John Doe',
        age: 45,
        email: 'john.doe@example.com',
        appointmentStatus: 'Confirmed',
        clinicalNotes: 'Patient has hypertension.',
      },
      {
        id: '2',
        name: 'Jane Smith',
        age: 32,
        email: 'jane.smith@example.com',
        appointmentStatus: 'Pending',
        clinicalNotes: 'Pregnancy checkup.',
      },
    ]);
    console.log('Seeded initial data');
  }
};

seedData();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});