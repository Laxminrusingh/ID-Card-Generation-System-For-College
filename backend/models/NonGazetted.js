const mongoose = require('mongoose');

const nonGazettedSchema = new mongoose.Schema({
  applicationId: { type: String, required: true, unique: true },
  name: String,
  designation: String,
  employeeNo: String,
  dob: String,
  department: String,
  station: String,
  billUnit: String,
  address: String,
  rlyContact: String,
  mobile: String,
  reason: String,
  emergencyName: String,
  emergencyNumber: String,
  photo: {
    data: Buffer,
    contentType: String
  },
  signature: {
    data: Buffer,
    contentType: String
  },
  familyMembers: [
    {
      name: String,
      bloodGroup: String,
      relationship: String,
      dob: String,
      identification: String,
    }
  ],
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

nonGazettedSchema.index({ applicationId: 1, dob: 1 });

module.exports = mongoose.model('NonGazetted', nonGazettedSchema);

