const mongoose = require('mongoose');

const gazettedSchema = new mongoose.Schema({
  applicationId: { type: String, required: true, unique: true },
  employeeName: String,
  designation: String,
  ruidNo: String,
  dob: String,
  department: String,
  billUnit: String,
  station: String,
  residentialAddress: String,
  rlyContactNumber: String,
  mobileNumber: String,
  reason: String,
  emergencyContactName: String,
  emergencyContactNumber: String,
  photo: {
    data: Buffer,
    contentType: String
  },
  signature: {
    data: Buffer,
    contentType: String
  },
  hindiName: String,
  hindiDesignation: String,
  familyMembers: [
    {
      name: String,
      bloodGroup: String,
      relationship: String,
      dob: String,
      identificationMark: String,
    }
  ],
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

gazettedSchema.index({ applicationId: 1, dob: 1 });

module.exports = mongoose.model('Gazetted', gazettedSchema);
