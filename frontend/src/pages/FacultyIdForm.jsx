import React, { useState } from 'react';

const FacultyIdForm = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    designation: '',
    department: '',
    ruidNo: '',
    dob: '',
    qualification: '',
    email: '',
    mobileNumber: '',
    residentialAddress: '',
    bloodGroup: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    photo: null,
    signature: null,
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [applicationId, setApplicationId] = useState('');
  const [showModal, setShowModal] = useState(false);

  const departments = [
    "Computer Science",
    "Electronics and Communication",
    "Electrican and Coumputer Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Humanities",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      // Backend API endpoint
      const response = await fetch('https://icard-railways-ecor.onrender.com/api/gazetted/register', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        setApplicationId(result.applicationId || 'FAC-' + Date.now());
        setSubmittedData(formData);
        setShowModal(true);
        // Reset form
        setFormData({
          employeeName: '', designation: '', department: '', ruidNo: '', dob: '',
          qualification: '', email: '', mobileNumber: '', residentialAddress: '', bloodGroup: '',
          emergencyContactName: '', emergencyContactNumber: '', photo: null, signature: null,
        });
      } else {
        alert(`Submission Error: ${result.message || 'Please try again'}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit form.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-xl space-y-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-800">Faculty ID Card Application Form</h2>

        {/* Faculty Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="employeeName" value={formData.employeeName} onChange={handleChange} placeholder="Full Name *" className="input" />
          <input name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation *" className="input" />
          <select name="department" value={formData.department} onChange={handleChange} className="input">
            <option value="">[Select Department]</option>
            {departments.map(dep => <option key={dep}>{dep}</option>)}
          </select>
          <input name="ruidNo" value={formData.ruidNo} onChange={handleChange} placeholder="Employee ID (RUID) *" className="input" />
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} placeholder="Date of Birth *" className="input" />
          <input name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Highest Qualification *" className="input" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email *" className="input" />
          <input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="Contact Number *" className="input" />
          <input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="Blood Group *" className="input" />
          <textarea name="residentialAddress" value={formData.residentialAddress} onChange={handleChange} placeholder="Residential Address *" className="input md:col-span-2" />
        </div>

        {/* Emergency Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg">
          <input name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} placeholder="Emergency Contact Name *" className="input" />
          <input name="emergencyContactNumber" value={formData.emergencyContactNumber} onChange={handleChange} placeholder="Emergency Contact Number *" className="input" />
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-pink-50 p-4 rounded-lg">
          <div>
            <label className="block mb-1 font-medium">Upload Passport Size Photo *</label>
            <input type="file" name="photo" accept=".jpg,.jpeg,.png" onChange={handleFileChange} className="file-input" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Upload Signature *</label>
            <input type="file" name="signature" accept=".jpg,.jpeg,.png" onChange={handleFileChange} className="file-input" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button type="reset" onClick={() => window.location.reload()} className="btn bg-gray-300 hover:bg-gray-400">Clear</button>
          <button type="submit" className="btn bg-green-700 hover:bg-green-800 text-white">Submit</button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">✅ Application Submitted Successfully!</h2>
            <div className="text-center mb-4">
              <p className="text-gray-600 mb-2">Your Application ID:</p>
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3">
                <span className="text-green-700 font-mono text-lg font-bold">{applicationId}</span>
                <p className="text-sm text-gray-600 mt-1">Please save this ID to check your status</p>
              </div>
            </div>
            <pre className="bg-gray-100 p-3 rounded-lg text-xs text-gray-800 max-h-60 overflow-y-auto">{JSON.stringify(formData, null, 2)}</pre>
            <button onClick={() => setShowModal(false)} className="mt-4 w-full btn bg-blue-600 hover:bg-blue-700 text-white">Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default FacultyIdForm;

