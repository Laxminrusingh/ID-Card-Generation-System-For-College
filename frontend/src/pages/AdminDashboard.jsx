import React, { useEffect, useState, useRef } from 'react';
import * as XLSX from 'xlsx';

const STATUS_OPTIONS = ['Pending', 'To Be Sent', 'Sent', 'Closed', 'Rejected'];
const PLACEHOLDER_IMG = 'https://via.placeholder.com/60x80?text=No+Image';

const gazettedColumns = [
  { label: 'Sl No', key: 'slno' },
  { label: 'Employee Name', key: 'employeeName' },
  { label: 'Designation', key: 'designation' },
  { label: 'RUID No.', key: 'ruidNo' },
  { label: 'DOB', key: 'dob' },
  { label: 'Department', key: 'department' },
  { label: 'Bill Unit', key: 'billUnit' },
  { label: 'Station', key: 'station' },
  { label: 'Residential Address', key: 'residentialAddress' },
  { label: 'Railway Contact No.', key: 'rlyContactNumber' },
  { label: 'Mobile Number', key: 'mobileNumber' },
  { label: 'Reason', key: 'reason' },
  { label: 'Emergency Contact Name', key: 'emergencyContactName' },
  { label: 'Emergency Contact Number', key: 'emergencyContactNumber' },
  { label: 'Photo', key: 'photo' },
  { label: 'Signature', key: 'signature' },
  { label: 'Hindi Name', key: 'hindiName' },
  { label: 'Hindi Designation', key: 'hindiDesignation' },
  { label: 'Family Members', key: 'familyMembers' },
  { label: 'Status', key: 'status' },
  { label: 'Actions', key: 'actions' },
];

const ngColumns = [
  { label: 'Sl No', key: 'slno' },
  { label: 'Name', key: 'name' },
  { label: 'Designation', key: 'designation' },
  { label: 'Employee No.', key: 'employeeNo' },
  { label: 'DOB', key: 'dob' },
  { label: 'Department', key: 'department' },
  { label: 'Bill Unit', key: 'billUnit' },
  { label: 'Station', key: 'station' },
  { label: 'Address', key: 'address' },
  { label: 'Railway Contact No.', key: 'rlyContact' },
  { label: 'Mobile Number', key: 'mobile' },
  { label: 'Reason', key: 'reason' },
  { label: 'Emergency Contact Name', key: 'emergencyName' },
  { label: 'Emergency Contact Number', key: 'emergencyNumber' },
  { label: 'Photo', key: 'photo' },
  { label: 'Signature', key: 'signature' },
  { label: 'Family Members', key: 'familyMembers' },
  { label: 'Status', key: 'status' },
  { label: 'Actions', key: 'actions' },
];

const AdminDashboard = () => {
  const [tab, setTab] = useState('gazetted');
  const [gazetted, setGazetted] = useState([]);
  const [nonGazetted, setNonGazetted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [statusSuccessId, setStatusSuccessId] = useState(null);
  const [rowStatus, setRowStatus] = useState({});
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [gzPage, setGzPage] = useState(1);
  const [gzPages, setGzPages] = useState(1);
  const [gzTotal, setGzTotal] = useState(0);
  const [ngPage, setNgPage] = useState(1);
  const [ngPages, setNgPages] = useState(1);
  const [ngTotal, setNgTotal] = useState(0);
  const limit = 20;
  const tableRef = useRef();
  const [showSlowLoading, setShowSlowLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        if (tab === 'gazetted') {
          const res = await fetch(`https://icard-railways-ecor.onrender.com/api/gazetted/all?page=${gzPage}&limit=${limit}`);
          const data = await res.json();
          setGazetted(data.data || []);
          setGzPages(data.pages || 1);
          setGzTotal(data.total || 0);
        } else {
          const res = await fetch(`https://icard-railways-ecor.onrender.com/api/ng/all?page=${ngPage}&limit=${limit}`);
          const data = await res.json();
          setNonGazetted(data.data || []);
          setNgPages(data.pages || 1);
          setNgTotal(data.total || 0);
        }
      } catch (err) {
        setError('Failed to fetch applications.');
      }
      setLoading(false);
    };
    fetchData();
  }, [tab, gzPage, ngPage]);

  useEffect(() => {
    let slowTimeout;
    if (loading) {
      slowTimeout = setTimeout(() => setShowSlowLoading(true), 3000);
    } else {
      setShowSlowLoading(false);
    }
    return () => clearTimeout(slowTimeout);
  }, [loading]);

  const handleStatusChange = async (type, applicationId, newStatus) => {
    setStatusUpdatingId(applicationId);
    try {
      const url = type === 'gazetted'
        ? 'https://icard-railways-ecor.onrender.com/api/gazetted/update-status'
        : 'https://icard-railways-ecor.onrender.com/api/ng/update-status';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      if (type === 'gazetted') {
        setGazetted(gazetted => gazetted.map(app => app.applicationId === applicationId ? { ...app, status: newStatus } : app));
      } else {
        setNonGazetted(nonGazetted => nonGazetted.map(app => app.applicationId === applicationId ? { ...app, status: newStatus } : app));
      }
      setStatusSuccessId(applicationId);
      setTimeout(() => setStatusSuccessId(null), 1500);
    } catch (err) {
      alert('Status update failed!');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const openModal = (app) => {
    setModalData(app);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = (data, type) => {
    const exportData = data.map((app, i) => ({
      'Sl No': i + 1,
      'EMPNO': app.employeeNo || app.ruidNo || '',
      'EMPNAME': app.employeeName || app.name || '',
      'DESIGNATION': app.designation || '',
      'DOB': app.dob || '',
      'DEPARTMENT': app.department || '',
      'STATION': app.station || '',
      'BILL UNIT': app.billUnit || '',
      'ADDRESS': app.residentialAddress || app.address || '',
      'RLY NUMBER': app.rlyContactNumber || app.rlyContact || '',
      'MOBILE NUMBER': app.mobileNumber || app.mobile || '',
      'EMERGENCY CONTACT NAME': app.emergencyContactName || app.emergencyName || '',
      'EMERGENCY CONTACT NO': app.emergencyContactNumber || app.emergencyNumber || '',
      'APPLICATION DATE': app.createdAt || '',
      'Status': app.status || '',
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, type === 'gazetted' ? 'Gazetted' : 'Non-Gazetted');
    XLSX.writeFile(wb, `${type}_applications.xlsx`);
  };

  const filterData = (data) => {
    let filtered = data;
    if (search) {
      filtered = filtered.filter(app =>
        Object.values(app).some(val =>
          val && val.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    return filtered;
  };

  const renderPagination = (page, setPage, pages) => (
    <div className="flex gap-2 justify-center mt-4">
      <button className="btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
      {Array.from({ length: pages }, (_, i) => (
        <button
          key={i}
          className={`btn ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setPage(i + 1)}
        >{i + 1}</button>
      ))}
      <button className="btn" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>Next</button>
    </div>
  );

  const renderTable = (data, type) => {
    const filtered = filterData(data);
    const columns = type === 'gazetted' ? gazettedColumns : ngColumns;
    return (
      <div className="overflow-x-auto">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Search..."
            className="input w-60"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="input w-48"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
          </select>
          <button className="btn bg-green-600 text-white" onClick={() => handleExport(filtered, type)}>Export Excel</button>
          <button className="btn bg-blue-600 text-white" onClick={handlePrint}>Print</button>
        </div>
        <table className="min-w-full bg-white border rounded-lg shadow print:text-xs print:min-w-0" ref={tableRef}>
          <thead className="bg-blue-100">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-2 py-1 whitespace-nowrap">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((app, idx) => (
              <tr key={app.applicationId} className="border-t hover:bg-blue-50 transition print:border-none">
                {columns.map(col => {
                  if (col.key === 'slno') return <td key={col.key}>{idx + 1}</td>;
                  if (col.key === 'photo') return <td key={col.key}><img src={`https://icard-railways-ecor.onrender.com/api/${type === 'gazetted' ? 'gazetted' : 'ng'}/photo/${app._id}`} alt="Photo" className="w-12 h-16 object-cover rounded border" onError={e => { e.target.src = PLACEHOLDER_IMG; }} /></td>;
                  if (col.key === 'signature') return <td key={col.key}><img src={`https://icard-railways-ecor.onrender.com/api/${type === 'gazetted' ? 'gazetted' : 'ng'}/signature/${app._id}`} alt="Signature" className="w-16 h-8 object-contain border" onError={e => { e.target.src = PLACEHOLDER_IMG; }} /></td>;
                  if (col.key === 'familyMembers') {
                    if (Array.isArray(app.familyMembers) && app.familyMembers.length > 0) {
                      return <td key={col.key}><ul className="text-xs">{app.familyMembers.map((fm, i) => <li key={i}>{Object.values(fm).join(', ')}</li>)}</ul></td>;
                    } else {
                      return <td key={col.key}>-</td>;
                    }
                  }
                  if (col.key === 'status') {
                    return (
                      <td key={col.key} className="flex items-center gap-2">
                        <select
                          className="input bg-white border border-gray-300 rounded"
                          value={rowStatus[app.applicationId] ?? app.status}
                          onChange={e => setRowStatus(s => ({ ...s, [app.applicationId]: e.target.value }))}
                        >
                          {STATUS_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                        <button
                          className={`btn bg-emerald-600 text-white text-xs ${statusUpdatingId === app.applicationId ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={statusUpdatingId === app.applicationId}
                          onClick={() => handleStatusChange(type, app.applicationId, rowStatus[app.applicationId] ?? app.status)}
                        >Change Status</button>
                        {statusSuccessId === app.applicationId && <span className="text-green-600 text-xs ml-2">Updated!</span>}
                      </td>
                    );
                  }
                  if (col.key === 'actions') {
                    return <td key={col.key} className="flex gap-2">
                      <button className="btn bg-blue-600 hover:bg-blue-700 text-white text-xs" onClick={() => openModal(app)}>View</button>
                      <button className="btn bg-green-600 hover:bg-green-700 text-white text-xs" onClick={() => handleDownloadCard(app)}>Download I-Card</button>
                      <button className="btn bg-red-600 hover:bg-red-700 text-white text-xs" onClick={() => handleDelete(type, app.applicationId)}>Delete</button>
                    </td>;
                  }
                  return <td key={col.key}>{app[col.key] || '-'}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center text-gray-500 py-8">No applications found.</div>}
        {type === 'gazetted'
          ? renderPagination(gzPage, setGzPage, gzPages)
          : renderPagination(ngPage, setNgPage, ngPages)}
      </div>
    );
  };

  const handleDownloadCard = (app) => {
    setCardData(app);
    setShowCardModal(true);
  };

  const handlePrintCard = () => {
    window.print();
  };

  const handleDelete = async (type, applicationId) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      const url = type === 'gazetted'
        ? `https://icard-railways-ecor.onrender.com/api/gazetted/${applicationId}`
        : `https://icard-railways-ecor.onrender.com/api/ng/${applicationId}`;
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete application');
      if (type === 'gazetted') {
        setGazetted(gazetted => gazetted.filter(app => app.applicationId !== applicationId));
      } else {
        setNonGazetted(nonGazetted => nonGazetted.filter(app => app.applicationId !== applicationId));
      }
    } catch (err) {
      alert('Delete failed!');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-10">
      <div className="bg-blue-100 shadow-lg rounded-xl px-8 py-6 w-full max-w-7xl mt-10">
        <h1 className="text-3xl font-bold text-center text-emerald-700 mb-2">Admin Dashboard</h1>
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`btn ${tab === 'gazetted' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTab('gazetted')}
          >Gazetted</button>
          <button
            className={`btn ${tab === 'non-gazetted' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTab('non-gazetted')}
          >Non-Gazetted</button>
        </div>
        {loading ? (
          <div className="text-center py-10 text-lg text-gray-500">
            Loading applications...<br />
            {showSlowLoading && <span className="text-orange-600">Server is waking up or slow, please wait...</span>}
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600">{error}</div>
        ) : (
          <div>
            {tab === 'gazetted' ? renderTable(gazetted, 'gazetted') : renderTable(nonGazetted, 'non-gazetted')}
          </div>
        )}
      </div>
      {/* Modal for application details */}
      {showModal && modalData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-blue-100 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border-2 border-blue-600 relative animate-fadeIn">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold" onClick={closeModal}>&times;</button>
            <h2 className="text-2xl font-extrabold text-blue-700 mb-2 text-center tracking-wide">Application Details</h2>
            <div className="bg-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-200">
              {/* Show main fields */}
              <div className="mb-2"><b>Status:</b> {modalData.status}</div>
              <div className="mb-2"><b>Name:</b> {modalData.employeeName || modalData.name}</div>
              <div className="mb-2"><b>Application ID:</b> {modalData.applicationId}</div>
              {/* Show image if available */}
              {modalData._id && (
                <div className="mb-2 flex gap-4 items-center">
                  {modalData.photo && (
                    <img src={`https://icard-railways-ecor.onrender.com/api/${tab === 'gazetted' ? 'gazetted' : 'ng'}/photo/${modalData._id}`} alt="Photo" style={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }} />
                  )}
                  {modalData.signature && (
                    <img src={`https://icard-railways-ecor.onrender.com/api/${tab === 'gazetted' ? 'gazetted' : 'ng'}/signature/${modalData._id}`} alt="Signature" style={{ width: 100, height: 40, objectFit: 'contain', borderRadius: 8, border: '1px solid #ccc' }} />
                  )}
                </div>
              )}
              {/* Show rest of the fields except photo/signature as JSON */}
              <pre className="whitespace-pre-wrap break-words text-xs text-gray-800 font-mono">
                {JSON.stringify((({ photo, signature, ...rest }) => rest)(modalData), null, 2)}
              </pre>
            </div>
            <button className="mt-6 w-full btn bg-blue-600 hover:bg-blue-700 text-white shadow-lg text-lg" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
      {/* Modal for I-Card download/print */}
      {showCardModal && cardData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-blue-100 rounded-2xl shadow-2xl p-8 max-w-xl w-full border-2 border-blue-600 relative animate-fadeIn">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold" onClick={closeModal}>&times;</button>
            <h2 className="text-3xl font-extrabold text-blue-700 mb-2 text-center tracking-wide">I-Card Preview</h2>
            <div id="id-card-preview" className="bg-white p-4 rounded-lg w-[380px] border border-gray-300 flex flex-col items-center print:shadow-none print:rounded-none print:border print:bg-white">
              {/* Logo and Railway Name */}
              <div className="flex flex-col items-center mb-2">
                <img src="/raillogo.png" alt="Railway Logo" className="h-12 mb-1" />
                <div className="text-2xl font-bold text-center leading-tight text-gray-900">पूर्व तट रेलवे<br/>East Coast Railway</div>
              </div>
              {/* Header Row */}
              <div className="flex flex-row w-full text-xs font-semibold text-white mb-2">
                <div className="flex-1 bg-cyan-700 py-1 px-2 text-center rounded-l">पहचान पत्र<br/>IDENTITY CARD</div>
                <div className="flex-1 bg-cyan-800 py-1 px-2 text-center">DEPARTMENT</div>
                <div className="flex-1 bg-cyan-700 py-1 px-2 text-center rounded-r">व्यावसायिक<br/>COMMERCIAL</div>
              </div>
              {/* Main Row: Photo, Details, Signature */}
              <div className="flex flex-row w-full items-center mb-2">
                {/* Photo */}
                <div className="flex flex-col items-center mr-2">
                  <img src={`https://icard-railways-ecor.onrender.com/api/${tab === 'gazetted' ? 'gazetted' : 'ng'}/photo/${cardData._id}`} alt="Photo" className="w-[90px] h-[110px] object-cover border border-gray-400 bg-gray-100" onError={e => { e.target.src = PLACEHOLDER_IMG; }} />
                </div>
                {/* Details Table */}
                <div className="flex-1 flex flex-col justify-center px-2">
                  <table className="text-[13px] w-full">
                    <tbody>
                      <tr><td className="pr-2 font-bold text-gray-700">नाम</td><td className="text-gray-700">: <b>{cardData.employeeName || cardData.name || '-'}</b></td></tr>
                      <tr><td className="pr-2 font-bold text-gray-700">पद नाम</td><td className="text-gray-700">: <b>{cardData.designation || '-'}</b></td></tr>
                      <tr><td className="pr-2 font-bold text-gray-700">पी.एफ.नं</td><td className="text-gray-700">: <b>{cardData.ruidNo || cardData.employeeNo || '-'}</b></td></tr>
                      <tr><td className="pr-2 font-bold text-gray-700">स्टेशन</td><td className="text-gray-700">: <b>{cardData.station || '-'}</b></td></tr>
                      <tr><td className="pr-2 font-bold text-gray-700">जन्म तिथि</td><td className="text-gray-700">: <b>{cardData.dob || '-'}</b></td></tr>
                      <tr><td className="pr-2 font-bold text-gray-700">DEPARTMENT</td><td className="text-gray-700">: <b>{cardData.department || '-'}</b></td></tr>
                    </tbody>
                  </table>
                </div>
                {/* Signature */}
                <div className="flex flex-col items-center ml-2">
                  <img src={`https://icard-railways-ecor.onrender.com/api/${tab === 'gazetted' ? 'gazetted' : 'ng'}/signature/${cardData._id}`} alt="Signature" className="w-[90px] h-[40px] object-contain border border-gray-400 bg-gray-100" onError={e => { e.target.src = PLACEHOLDER_IMG; }} />
                  <span className="text-[10px] mt-1 text-gray-600">प्रमाणित प्राधिकारी का हस्ताक्षर<br/>Signature of Issuing Authority</span>
                </div>
              </div>
              {/* Family Details */}
              <div className="w-full border-t border-gray-200 pt-2 mt-2">
                <div className="font-bold text-center mb-1 text-gray-700 text-[14px]">परिवार का विवरण/Details of the family</div>
                {Array.isArray(cardData.familyMembers) && cardData.familyMembers.length > 0 ? (
                  <table className="w-full text-xs mt-1 border">
                    <thead>
                      <tr className="bg-gray-200">
                        <th>Name</th><th>Relation</th><th>DOB</th><th>BG</th><th>Identification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cardData.familyMembers.map((fm, i) => (
                        <tr key={i}>
                          <td>{fm.name}</td>
                          <td>{fm.relationship}</td>
                          <td>{fm.dob}</td>
                          <td>{fm.bloodGroup}</td>
                          <td>{fm.identificationMark || fm.identification}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <div className="text-center text-xs">No family details</div>}
                {/* Emergency Contact and Address */}
                <div className="mt-2 font-bold text-gray-700 text-xs">Emergency Contact No. : <span className="font-mono">{cardData.emergencyContactNumber || cardData.emergencyNumber || '-'}</span></div>
                <div className="text-gray-700 text-xs">घर का पता/Res.Address: {cardData.residentialAddress || cardData.address || '-'}</div>
                {/* Lost & Found Message */}
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-gray-500">यदि यह कार्ड मिले तो कृपया निकटतम पोस्ट बॉक्स में डाल दें।<br/>If found please drop it in the nearest Post Box</span>
                </div>
              </div>
            </div>
            <button className="mt-6 w-full btn bg-blue-600 hover:bg-blue-700 text-white shadow-lg text-lg print:hidden" onClick={handlePrintCard}>Print / Download</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 