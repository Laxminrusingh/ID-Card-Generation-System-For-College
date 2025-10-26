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
    // Generate unique applicationId
    const applicationId = 'NG' + Date.now() + Math.floor(Math.random() * 1000);
    // Save to database
    const newApp = new NonGazetted({
      ...body,
      applicationId,
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
    });
    await newApp.save();

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
