import React, { useState, useEffect } from 'react';

const ApplicationStatus = () => {
  const [gazStatus, setGazStatus] = useState({ applicationId: '', dob: '' });
  const [ngStatus, setNgStatus] = useState({ applicationId: '', dob: '' });
  const [gazResult, setGazResult] = useState(null);
  const [ngResult, setNgResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleGazChange = (e) => {
    const { name, value } = e.target;
    setGazStatus((prev) => ({ ...prev, [name]: value }));
  };

  const handleNgChange = (e) => {
    const { name, value } = e.target;
    setNgStatus((prev) => ({ ...prev, [name]: value }));
  };

  const handleGazSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://icard-railways-ecor.onrender.com/api/status/gazetted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gazStatus),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setGazResult({ type: 'success', data });
      setModalData(data);
      setShowModal(true);
    } catch (err) {
      setGazResult({ type: 'error', message: err.message });
    }
  };

  const handleNgSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://icard-railways-ecor.onrender.com/api/status/nongazetted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ngStatus),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setNgResult({ type: 'success', data });
      setModalData(data);
      setShowModal(true);
    } catch (err) {
      setNgResult({ type: 'error', message: err.message });
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl justify-center mt-28">
        {/* Gazetted Section */}
        <form
          onSubmit={handleGazSubmit}
          className="bg-blue-100 border border-blue-200 p-6 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-xl font-semibold text-green-800 mb-4">Application Status (Faculty)</h2>
          <input
            type="text"
            name="applicationId"
            value={gazStatus.applicationId}
            onChange={handleGazChange}
            placeholder="Enter Application ID"
            className="input mb-4"
            required
          />
          <input
            type="date"
            name="dob"
            value={gazStatus.dob}
            onChange={handleGazChange}
            className="input mb-4"
            required
          />
          <button type="submit" className="btn bg-green-600 hover:bg-green-700 text-white w-full mb-4">
            Submit
          </button>
          {gazResult && (
            <div className={`text-sm ${gazResult.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
              {gazResult.type === 'success' ? (
                <pre>{JSON.stringify((({ photo, signature, ...rest }) => rest)(gazResult.data), null, 2)}</pre>
              ) : (
                gazResult.message
              )}
            </div>
          )}
        </form>

        {/* Non-Gazetted Section */}
        <form
          onSubmit={handleNgSubmit}
          className="bg-blue-100 border border-blue-200 p-6 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-xl font-semibold text-red-800 mb-4">Application Status (Student)</h2>
          <input
            type="text"
            name="applicationId"
            value={ngStatus.applicationId}
            onChange={handleNgChange}
            placeholder="Enter Application ID"
            className="input mb-4"
            required
          />
          <input
            type="date"
            name="dob"
            value={ngStatus.dob}
            onChange={handleNgChange}
            className="input mb-4"
            required
          />
          <button type="submit" className="btn bg-green-600 hover:bg-green-700 text-white w-full mb-4">
            Submit
          </button>
          {ngResult && (
            <div className={`text-sm ${ngResult.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
              {ngResult.type === 'success' ? (
                <pre>{JSON.stringify((({ photo, signature, ...rest }) => rest)(ngResult.data), null, 2)}</pre>
              ) : (
                ngResult.message
              )}
            </div>
          )}
        </form>
      </div>
      {/* Modal Popup for Application Info */}
      {showModal && modalData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-blue-100 rounded-2xl shadow-2xl p-8 max-w-xl w-full border-2 border-blue-600 relative animate-fadeIn">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-3xl font-extrabold text-blue-700 mb-2 text-center tracking-wide">Application Details</h2>
            <div className="flex flex-col items-center mb-4">
              <span className="text-lg font-semibold text-gray-700">Application ID:</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xl text-green-700 bg-green-50 px-3 py-1 rounded-lg border border-green-200 select-all">{modalData.applicationId}</span>
                <button className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition" onClick={() => {navigator.clipboard.writeText(modalData.applicationId)}} title="Copy Application ID">Copy</button>
              </div>
            </div>
            <h3 className="font-semibold mt-4 mb-2 text-blue-700 text-center">
              Status: <span className={`text-lg font-bold ${
                modalData.status === 'Approved' ? 'text-green-600' :
                modalData.status === 'Rejected' ? 'text-red-600' :
                'text-yellow-600'
              }`}>{modalData.status || 'N/A'}</span>
            </h3>
            {modalData.status === 'Rejected' && modalData.remark && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 font-medium">Rejection Reason:</p>
                <p className="text-red-600">{modalData.remark}</p>
              </div>
            )}
            <div className="bg-gray-100 rounded-lg p-4 max-h-64 overflow-y-auto border border-gray-200">
              {/* Show image if available */}
              {modalData._id && (
                <div className="mb-2 flex gap-4 items-center">
                  {modalData.photo && (
                    <img 
                      src={`https://icard-railways-ecor.onrender.com/api/${modalData.name ? 'ng' : 'gazetted'}/photo/${modalData._id}`} 
                      alt="Photo" 
                      style={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }} 
                      onError={e => e.target.style.display = 'none'}
                    />
                  )}
                  {modalData.signature && (
                    <img 
                      src={`https://icard-railways-ecor.onrender.com/api/${modalData.name ? 'ng' : 'gazetted'}/signature/${modalData._id}`} 
                      alt="Signature" 
                      style={{ width: 100, height: 40, objectFit: 'contain', borderRadius: 8, border: '1px solid #ccc' }} 
                      onError={e => e.target.style.display = 'none'}
                    />
                  )}
                </div>
              )}
              {/* Show rest of the fields except photo/signature as JSON */}
              <pre className="whitespace-pre-wrap break-words text-xs text-gray-800 font-mono">
                {JSON.stringify((({ photo, signature, ...rest }) => rest)(modalData), null, 2)}
              </pre>
            </div>
            <button className="mt-6 w-full btn bg-blue-600 hover:bg-blue-700 text-white shadow-lg text-lg" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationStatus;
