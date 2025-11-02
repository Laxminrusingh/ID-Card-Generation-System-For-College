const express = require('express');
const router = express.Router();
const multer = require('multer');
const Gazetted = require('../models/Gazetted');
const { getAllGazetted, updateGazettedStatus } = require('../controllers/statuscontroller');

// Storage configuration (optional: you can store in memory or disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Accept form-data with files
router.post('/register', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'signature', maxCount: 1 },
  { name: 'hindiName', maxCount: 1 },
  { name: 'hindiDesignation', maxCount: 1 }
]), async (req, res) => {
  const { body, files } = req;

  try {
    // Generate unique applicationId for Faculty
    const applicationId = 'FAC-' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100);
    // Log for debugging
    console.log('Received Gazetted body:', body);
    console.log('Received Gazetted files:', files);
    // Map frontend fields to backend model fields
    const mappedData = {
      applicationId,
      employeeName: body.name,
      designation: body.designation,
      ruidNo: body.employeeId,
      dob: body.dateOfBirth,
      department: body.department,
      residentialAddress: body.address,
      mobileNumber: body.contactNumber,
      emergencyContactName: body.emergencyContactName,
      emergencyContactNumber: body.emergencyContactNumber,
      status: 'Pending',
      photo: files.photo ? {
        data: files.photo[0].buffer,
        contentType: files.photo[0].mimetype
      } : undefined,
      signature: files.signature ? {
        data: files.signature[0].buffer,
        contentType: files.signature[0].mimetype
      } : undefined,
      familyMembers: body.familyMembers ? JSON.parse(body.familyMembers) : [],
    };

    // Save to database
    const newApp = new Gazetted(mappedData);
    await newApp.save();
    console.log('Saved Gazetted application:', { 
      applicationId: newApp.applicationId, 
      employeeName: newApp.employeeName,
      ruidNo: newApp.ruidNo,
      dob: newApp.dob, 
      mobileNumber: newApp.mobileNumber,
      residentialAddress: newApp.residentialAddress,
      status: newApp.status 
    });

    // TODO: Save other fields and files if needed

    res.status(200).json({ message: 'Gazetted employee registered successfully', applicationId });
  } catch (error) {
    console.error('Error while saving gazetted data:', error);
    res.status(500).json({ message: 'Failed to register gazetted employee', error: error.message });
  }
});

// Serve photo by application ID
router.get('/photo/:id', async (req, res) => {
  const app = await Gazetted.findById(req.params.id);
  if (!app || !app.photo || !app.photo.data) return res.status(404).send('Not found');
  res.contentType(app.photo.contentType);
  res.send(app.photo.data);
});

// Serve signature by application ID
router.get('/signature/:id', async (req, res) => {
  const app = await Gazetted.findById(req.params.id);
  if (!app || !app.signature || !app.signature.data) return res.status(404).send('Not found');
  res.contentType(app.signature.contentType);
  res.send(app.signature.data);
});

router.get('/all', getAllGazetted);

router.post('/update-status', updateGazettedStatus);

// Add DELETE endpoint for gazetted application
router.delete('/:applicationId', async (req, res) => {
  try {
    const result = await Gazetted.findOneAndDelete({ applicationId: req.params.applicationId });
    if (!result) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 