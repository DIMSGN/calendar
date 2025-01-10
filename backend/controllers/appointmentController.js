const Appointment = require('../models/appointment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.id}-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

exports.uploadDocument = [
  upload.single('document'),
  async (req, res) => {
    const { id } = req.params;
    const documentPath = `uploads/${req.file.filename}`;

    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      res.status(200).json({ path: documentPath });
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload document' });
    }
  },
];

// Fetch document names for an appointment
exports.getDocumentNames = async (req, res) => {
  const { id } = req.params;

  try {
    const documentsDir = path.join(__dirname, '../uploads');
    const files = fs.readdirSync(documentsDir);
    const documentNames = files
      .filter(file => file.startsWith(`${id}-`))
      .map(file => ({
        name: file.replace(`${id}-`, ''),
        path: `uploads/${file}`
      }));

    res.status(200).json(documentNames);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch document names' });
  }
};

// Delete a document by name
exports.deleteDocument = (req, res) => {
  const { id, documentName } = req.params;
  const documentPath = path.join(__dirname, '../uploads', `${id}-${documentName}`);

  fs.unlink(documentPath, (err) => {
    if (err) {
      console.error("Error deleting document:", err);
      return res.status(500).send('Failed to delete document.');
    }
    res.send('Document deleted successfully.');
  });
};

// Create a new appointment
exports.createAppointment = async (req, res) => {
  const { title, description, startDate, endDate } = req.body;

  try {
    const appointment = await Appointment.create({
      title,
      description,
      startDate,
      endDate,
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

// Get a specific appointment by ID
exports.getAppointmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
};

// Update an appointment by ID
exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { title, description, startDate, endDate } = req.body;

  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    appointment.title = title;
    appointment.description = description;
    appointment.startDate = startDate;
    appointment.endDate = endDate;

    await appointment.save();
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

// Delete an appointment by ID
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await appointment.destroy();
    res.status(200).json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
};
