const Gazetted = require('../models/Gazetted');
const NonGazetted = require('../models/NonGazetted');

exports.getGazStatus = async (req, res) => {
  const { applicationId, dob } = req.body;
  console.log('Searching for Gazetted:', { applicationId, dob });
  try {
    const record = await Gazetted.findOne({ applicationId, dob });
    console.log('Found Gazetted record:', record ? 'Yes' : 'No');
    if (!record) return res.status(404).json({ message: 'Application not found' });
    res.json(record);
  } catch (err) {
    console.error('Gazetted search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getNgStatus = async (req, res) => {
  const { applicationId, dob } = req.body;
  console.log('Searching for NonGazetted:', { applicationId, dob });
  try {
    const record = await NonGazetted.findOne({ applicationId, dob });
    console.log('Found NonGazetted record:', record ? 'Yes' : 'No');
    if (!record) return res.status(404).json({ message: 'Application not found' });
    res.json(record);
  } catch (err) {
    console.error('NonGazetted search error:', err);
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
    console.log('Gazetted records found:', records.length);
    if (records.length > 0) {
      console.log('Sample Gazetted record:', {
        applicationId: records[0].applicationId,
        employeeName: records[0].employeeName,
        ruidNo: records[0].ruidNo,
        dob: records[0].dob,
        mobileNumber: records[0].mobileNumber,
        residentialAddress: records[0].residentialAddress,
        status: records[0].status
      });
    }
    res.json({ data: records, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('getAllGazetted error:', err);
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
    console.log('NonGazetted records found:', records.length);
    if (records.length > 0) {
      console.log('Sample NonGazetted record:', {
        applicationId: records[0].applicationId,
        name: records[0].name,
        dob: records[0].dob,
        status: records[0].status
      });
    }
    res.json({ data: records, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('getAllNonGazetted error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateGazettedStatus = async (req, res) => {
  const { applicationId, status, remark } = req.body;
  try {
    const updateData = { status };
    if (status === 'Rejected' && remark) {
      updateData.remark = remark;
    }
    const updated = await Gazetted.findOneAndUpdate(
      { applicationId },
      updateData,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Application not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateNonGazettedStatus = async (req, res) => {
  const { applicationId, status, remark } = req.body;
  try {
    const updateData = { status };
    if (status === 'Rejected' && remark) {
      updateData.remark = remark;
    }
    const updated = await NonGazetted.findOneAndUpdate(
      { applicationId },
      updateData,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Application not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
