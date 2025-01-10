const express = require('express');
const AppointmentController = require('../controllers/appointmentController');

const router = express.Router();

// Create an appointment
router.post('/', AppointmentController.createAppointment);

// Get all appointments
router.get('/', AppointmentController.getAllAppointments);

// Get a specific appointment by ID
router.get('/:id', AppointmentController.getAppointmentById);

// Update an appointment by ID
router.put('/:id', AppointmentController.updateAppointment);

// Delete an appointment by ID
router.delete('/:id', AppointmentController.deleteAppointment);

// Upload a document for an appointment
router.post('/:id/upload', AppointmentController.uploadDocument);

// Get document names for an appointment
router.get('/:id/documents', AppointmentController.getDocumentNames);

module.exports = router;