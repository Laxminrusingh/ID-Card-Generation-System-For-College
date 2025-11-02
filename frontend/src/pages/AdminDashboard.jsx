import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const STATUS_OPTIONS = ['Pending', 'Approved', 'Rejected'];
const PLACEHOLDER_IMG = 'https://via.placeholder.com/60x80?text=No+Image';

const gazettedColumns = [
  { label: 'Sl No', key: 'slno' },
  { label: 'Application ID', key: 'applicationId' },
  { label: 'Name', key: 'employeeName' },
  { label: 'Designation', key: 'designation' },
  { label: 'Employee ID', key: 'ruidNo' },
  { label: 'DOB', key: 'dob' },
  { label: 'Department', key: 'department' },
  { label: 'Contact Number', key: 'mobileNumber' },
  { label: 'Address', key: 'residentialAddress' },
  { label: 'Emergency Contact', key: 'emergencyContactName' },
  { label: 'Emergency Number', key: 'emergencyContactNumber' },
  { label: 'Photo', key: 'photo' },
  { label: 'Signature', key: 'signature' },
  { label: 'Status', key: 'status' },
  { label: 'Actions', key: 'actions' },
];

const ngColumns = [
  { label: 'Sl No', key: 'slno' },
  { label: 'Application ID', key: 'applicationId' },
  { label: 'Name', key: 'name' },
  { label: 'Course', key: 'course' },
  { label: 'Registration No.', key: 'registrationNo' },
  { label: 'DOB', key: 'dob' },
  { label: 'Department', key: 'department' },
  { label: 'Mobile Number', key: 'mobile' },
  { label: 'Address', key: 'address' },
  { label: 'Emergency Contact', key: 'emergencyName' },
  { label: 'Emergency Number', key: 'emergencyNumber' },
  { label: 'Photo', key: 'photo' },
  { label: 'Signature', key: 'signature' },
  { label: 'Status', key: 'status' },
  { label: 'Actions', key: 'actions' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
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
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        if (tab === 'gazetted') {
          const res = await fetch(`https://icard-railways-ecor.onrender.com/api/gazetted/all?page=${gzPage}&limit=${limit}`);
          const data = await res.json();
          console.log('Gazetted data received:', data);
          setGazetted(data.data || []);
          setGzPages(data.pages || 1);
          setGzTotal(data.total || 0);
        } else {
          const res = await fetch(`https://icard-railways-ecor.onrender.com/api/ng/all?page=${ngPage}&limit=${limit}`);
          const data = await res.json();
          console.log('NonGazetted data received:', data);
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

  const handleDelete = async (type, applicationId) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      const url = type === 'gazetted'
        ? `https://icard-railways-ecor.onrender.com/api/gazetted/${applicationId}`
        : `https://icard-railways-ecor.onrender.com/api/ng/${applicationId}`;
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      if (type === 'gazetted') {
        setGazetted(gazetted => gazetted.filter(app => app.applicationId !== applicationId));
        setGzTotal(prev => prev - 1);
      } else {
        setNonGazetted(nonGazetted => nonGazetted.filter(app => app.applicationId !== applicationId));
        setNgTotal(prev => prev - 1);
      }
      alert('Application deleted successfully!');
    } catch (err) {
      alert('Delete failed!');
    }
  };

  const handleStatusChange = async (type, applicationId, newStatus) => {
    setStatusUpdatingId(applicationId);
    let remark = '';
    if (newStatus === 'Rejected') {
      remark = prompt('Please enter rejection reason:');
      if (!remark) {
        setStatusUpdatingId(null);
        return;
      }
    }
    try {
      const url = type === 'gazetted'
        ? 'https://icard-railways-ecor.onrender.com/api/gazetted/update-status'
        : 'https://icard-railways-ecor.onrender.com/api/ng/update-status';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status: newStatus, remark }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      if (type === 'gazetted') {
        setGazetted(gazetted => gazetted.map(app => 
          app.applicationId === applicationId ? { ...app, status: newStatus, remark } : app
        ));
      } else {
        setNonGazetted(nonGazetted => nonGazetted.map(app => 
          app.applicationId === applicationId ? { ...app, status: newStatus, remark } : app
        ));
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
      'EMPNO': type === 'gazetted' ? app.ruidNo : app.registrationNo || '',
      'EMPNAME': type === 'gazetted' ? app.employeeName : app.name || '',
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
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 border rounded w-full md:w-60"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="px-3 py-2 border rounded w-full md:w-48"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
          </select>
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700" onClick={() => handleExport(filtered, type)}>Export</button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700" onClick={handlePrint}>Print</button>
          </div>
        </div>
        <table className="min-w-full bg-white border rounded-lg shadow text-xs md:text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.filter(col => col.key !== 'actions').map(col => (
                <th key={col.key} className="px-1 md:px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  {col.label}
                </th>
              ))}
              <th className="px-1 md:px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase print:hidden">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((app, i) => (
              <tr key={app.applicationId || i} className="hover:bg-gray-50">
                <td className="px-1 md:px-2 py-2 text-xs md:text-sm">{i + 1}</td>
                <td className="px-1 md:px-2 py-2 text-xs md:text-sm font-mono text-blue-600">{app.applicationId}</td>
                <td className="px-1 md:px-2 py-2 text-xs md:text-sm">{type === 'gazetted' ? app.employeeName : app.name}</td>
                <td className="px-1 md:px-2 py-2 text-xs md:text-sm">{type === 'gazetted' ? app.designation : app.course}</td>
                <td className="px-1 md:px-2 py-2 text-xs md:text-sm">{type === 'gazetted' ? app.ruidNo : app.registrationNo}</td>
                <td className="px-2 py-2 text-sm">{app.dob}</td>
                <td className="px-2 py-2 text-sm">{app.department}</td>
                <td className="px-2 py-2 text-sm">{type === 'gazetted' ? app.mobileNumber : app.mobile}</td>
                <td className="px-2 py-2 text-sm max-w-xs truncate">{type === 'gazetted' ? app.residentialAddress : app.address}</td>
                <td className="px-2 py-2 text-sm">{type === 'gazetted' ? app.emergencyContactName : app.emergencyName}</td>
                <td className="px-2 py-2 text-sm">{type === 'gazetted' ? app.emergencyContactNumber : app.emergencyNumber}</td>
                <td className="px-2 py-2">
                  {app._id && app.photo ? (
                    <img 
                      src={`https://icard-railways-ecor.onrender.com/api/${type === 'gazetted' ? 'gazetted' : 'ng'}/photo/${app._id}`} 
                      alt="Photo" 
                      className="w-12 h-16 object-cover rounded" 
                      onError={e => e.target.src = PLACEHOLDER_IMG} 
                    />
                  ) : (
                    <img src={PLACEHOLDER_IMG} alt="No Photo" className="w-12 h-16 object-cover rounded" />
                  )}
                </td>
                <td className="px-2 py-2">
                  {app._id && app.signature ? (
                    <img 
                      src={`https://icard-railways-ecor.onrender.com/api/${type === 'gazetted' ? 'gazetted' : 'ng'}/signature/${app._id}`} 
                      alt="Signature" 
                      className="w-16 h-8 object-cover rounded" 
                      onError={e => e.target.src = PLACEHOLDER_IMG} 
                    />
                  ) : (
                    <img src={PLACEHOLDER_IMG} alt="No Signature" className="w-16 h-8 object-cover rounded" />
                  )}
                </td>

                <td className="px-2 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {statusSuccessId === app.applicationId ? '✓ Updated' : app.status}
                  </span>
                </td>
                <td className="px-2 py-2 print:hidden">
                  <div className="flex items-center gap-2">
                    <select
                      className="text-xs border rounded px-2 py-1 w-32"
                      value={app.status}
                      onChange={e => handleStatusChange(type, app.applicationId, e.target.value)}
                      disabled={statusUpdatingId === app.applicationId}
                    >
                      {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                        onClick={() => handleDelete(type, app.applicationId)}
                      >
                        Delete
                      </button>
                      {app.status === 'Rejected' && app.remark && (
                        <span className="text-xs text-red-600 ml-2" title={app.remark}>
                          Reason: {app.remark}
                        </span>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  if (!localStorage.getItem('isLoggedIn')) {
    return null;
  }

  return (
    <div className="p-2 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-2">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button onClick={logout} className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm md:text-base">
          Logout
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">Loading applications...</p>
          {showSlowLoading && <p className="text-sm text-gray-600">This is taking longer than usual...</p>}
        </div>
      )}

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex flex-col md:flex-row md:space-x-8">
            <button
              className={`py-3 px-4 md:py-4 md:px-6 border-b-2 font-medium text-xs md:text-sm ${
                tab === 'gazetted'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setTab('gazetted')}
            >
              Faculty Applications ({gzTotal})
            </button>
            <button
              className={`py-3 px-4 md:py-4 md:px-6 border-b-2 font-medium text-xs md:text-sm ${
                tab === 'non-gazetted'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setTab('non-gazetted')}
            >
              Student Applications ({ngTotal})
            </button>
          </nav>
        </div>

        <div className="p-2 md:p-6">
          {tab === 'gazetted' ? (
            <>
              {renderTable(gazetted, 'gazetted')}
              {renderPagination(gzPage, setGzPage, gzPages)}
            </>
          ) : (
            <>
              {renderTable(nonGazetted, 'non-gazetted')}
              {renderPagination(ngPage, setNgPage, ngPages)}
            </>
          )}
        </div>
      </div>

      {showModal && modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Family Members</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            {modalData.familyMembers && modalData.familyMembers.length > 0 ? (
              <div className="space-y-4">
                {modalData.familyMembers.map((member, i) => (
                  <div key={i} className="border rounded p-3">
                    <p><strong>Name:</strong> {member.name}</p>
                    <p><strong>Relation:</strong> {member.relation}</p>
                    <p><strong>DOB:</strong> {member.dob}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No family members added.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;