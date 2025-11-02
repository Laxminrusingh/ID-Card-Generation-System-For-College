// routes/ngRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const NonGazetted = require('../models/NonGazetted');
const { getAllNonGazetted, updateNonGazettedStatus } = require('../controllers/statuscontroller');

// Storage configuration (optional: you can store in memory or disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Accept form-data with files
router.post('/register', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]), async (req, res) => {
  const { body, files } = req;

  try {
    // Generate unique applicationId for Student
    const applicationId = 'STU-' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100);
    console.log('Received NonGazetted body:', body);
    console.log('Received NonGazetted files:', files);
    // Map frontend fields to backend model fields
    const mappedData = {
      applicationId,
      name: body.name,
      registrationNo: body.registrationNo,
      dob: body.dob,
      course: body.course,
      department: body.department,
      mobile: body.phone,
      address: body.address,
      emergencyName: body.guardianName,
      emergencyNumber: body.guardianContact,
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
    const newApp = new NonGazetted(mappedData);
    await newApp.save();
    console.log('Saved NonGazetted application:', { applicationId: newApp.applicationId, dob: newApp.dob });

    res.status(200).json({ message: 'Employee registered successfully', applicationId });
  } catch (error) {
    console.error('Error while saving data:', error);
    res.status(500).json({ message: 'Failed to register employee' });
  }
});

// Serve photo by application ID
router.get('/photo/:id', async (req, res) => {
  const app = await NonGazetted.findById(req.params.id);
  if (!app || !app.photo || !app.photo.data) return res.status(404).send('Not found');
  res.contentType(app.photo.contentType);
  res.send(app.photo.data);
});

// Serve signature by application ID
router.get('/signature/:id', async (req, res) => {
  const app = await NonGazetted.findById(req.params.id);
  if (!app || !app.signature || !app.signature.data) return res.status(404).send('Not found');
  res.contentType(app.signature.contentType);
  res.send(app.signature.data);
});

router.get('/all', getAllNonGazetted);

router.post('/update-status', updateNonGazettedStatus);

// Add DELETE endpoint for non-gazetted application
router.delete('/:applicationId', async (req, res) => {
  try {
    const result = await NonGazetted.findOneAndDelete({ applicationId: req.params.applicationId });
    if (!result) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
