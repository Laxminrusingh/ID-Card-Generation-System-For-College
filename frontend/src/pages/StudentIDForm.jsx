import React, { useState } from "react";

const StudentIDForm = () => {
  const [studentData, setStudentData] = useState({
    name: "",
    registrationNo: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    course: "",
    department: "",
    year: "",
    section: "",
    phone: "",
    email: "",
    address: "",
    guardianName: "",
    guardianContact: "",
    photo: null,
    signature: null,
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  const departments = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];
  const courses = ["B.Tech", "B.Sc", "M.Tech", "MBA", "MCA"];
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const genders = ["Male", "Female", "Other"];

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({ ...prev, [name]: value }));
  };

  // File upload
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setStudentData((prev) => ({ ...prev, [name]: files[0] }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      for (const key in studentData) {
        data.append(key, studentData[key]);
      }

      // Replace with your backend endpoint:
      const response = await fetch("http://localhost:5000/api/ng/register", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        setApplicationId(result.applicationId || "STU-" + Date.now());
        setSubmittedData(studentData);
        setShowModal(true);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Form submission failed!");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white shadow-md rounded-xl space-y-6 max-w-5xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-blue-800 text-center">
          College Student ID Card Application Form
        </h2>

        {/* Student Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="name"
            value={studentData.name}
            onChange={handleChange}
            placeholder="Full Name *"
            className="input"
            required
          />
          <input
            name="registrationNo"
            value={studentData.registrationNo}
            onChange={handleChange}
            placeholder="Registration No *"
            className="input"
            required
          />
          <input
            type="date"
            name="dob"
            value={studentData.dob}
            onChange={handleChange}
            className="input"
            required
          />
          <select
            name="gender"
            value={studentData.gender}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select Gender</option>
            {genders.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <input
            name="bloodGroup"
            value={studentData.bloodGroup}
            onChange={handleChange}
            placeholder="Blood Group *"
            className="input"
          />
          <select
            name="course"
            value={studentData.course}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            name="department"
            value={studentData.department}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep}>{dep}</option>
            ))}
          </select>
          <select
            name="year"
            value={studentData.year}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
          <input
            name="section"
            value={studentData.section}
            onChange={handleChange}
            placeholder="Section *"
            className="input"
          />
          <input
            name="phone"
            value={studentData.phone}
            onChange={handleChange}
            placeholder="Mobile Number *"
            className="input"
          />
          <input
            name="email"
            value={studentData.email}
            onChange={handleChange}
            placeholder="Email ID *"
            className="input"
          />
          <textarea
            name="address"
            value={studentData.address}
            onChange={handleChange}
            placeholder="Address *"
            className="input col-span-2"
          />
          <input
            name="guardianName"
            value={studentData.guardianName}
            onChange={handleChange}
            placeholder="Guardian Name *"
            className="input"
          />
          <input
            name="guardianContact"
            value={studentData.guardianContact}
            onChange={handleChange}
            placeholder="Guardian Contact *"
            className="input"
          />
        </div>

        {/* Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg">
          <div>
            <label className="block mb-1 font-medium">Upload Photo *</label>
            <input
              type="file"
              name="photo"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Upload Signature *</label>
            <input
              type="file"
              name="signature"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="reset"
            onClick={() => window.location.reload()}
            className="btn bg-gray-300 hover:bg-gray-400"
          >
            Clear
          </button>
          <button
            type="submit"
            className="btn bg-blue-600 hover:bg-blue-700 text-white"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xl w-full border-2 border-blue-600 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-3xl font-extrabold text-blue-700 mb-2 text-center">
              Application Submitted!
            </h2>
            <p className="text-center text-gray-600">
              Your Application ID:{" "}
              <span className="text-green-700 font-mono">{applicationId}</span>
            </p>

            <div className="bg-gray-100 rounded-lg p-4 mt-4 max-h-64 overflow-y-auto border border-gray-200">
              <pre className="whitespace-pre-wrap break-words text-xs text-gray-800 font-mono">
                {JSON.stringify(studentData, null, 2)}
              </pre>
            </div>
            <button
              className="mt-6 w-full btn bg-blue-600 hover:bg-blue-700 text-white shadow-lg text-lg"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentIDForm;

