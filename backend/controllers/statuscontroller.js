const Gazetted = require('../models/Gazetted');
const NonGazetted = require('../models/NonGazetted');

exports.getGazStatus = async (req, res) => {
  const { applicationId, dob } = req.body;
  try {
    const record = await Gazetted.findOne({ applicationId, dob });
    if (!record) return res.status(404).json({ message: 'Application not found' });
    res.json({ status: record.status });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getNgStatus = async (req, res) => {
  const { applicationId, dob } = req.body;
  try {
    const record = await NonGazetted.findOne({ applicationId, dob });
    if (!record) return res.status(404).json({ message: 'Application not found' });
    res.json({ status: record.status });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllGazetted = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const total = await Gazetted.countDocuments();
    const records = await Gazetted.find().skip(skip).limit(limit);
    res.json({ data: records, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllNonGazetted = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const total = await NonGazetted.countDocuments();
    const records = await NonGazetted.find().skip(skip).limit(limit);
    res.json({ data: records, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateGazettedStatus = async (req, res) => {
  const { applicationId, status } = req.body;
  try {
    const updated = await Gazetted.findOneAndUpdate(
      { applicationId },
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Application not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateNonGazettedStatus = async (req, res) => {
  const { applicationId, status } = req.body;
  try {
    const updated = await NonGazetted.findOneAndUpdate(
      { applicationId },
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Application not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
