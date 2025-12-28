import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintAPI } from '../utils/api';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch complaints from API
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await complaintAPI.getComplaints();
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ResolveIt Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">My Complaints</h2>
          <Link
            to="/complaint/new"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Create New Complaint
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <p>Loading complaints...</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {complaints.length === 0 ? (
                <li className="px-6 py-4 text-center">
                  <p className="text-gray-500">No complaints found. Create your first complaint!</p>
                </li>
              ) : (
                complaints.map((complaint) => (
                  <li key={complaint._id}>
                    <Link to={`/complaint/${complaint._id}`} className="block hover:bg-gray-50">
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-medium text-indigo-600 truncate">
                            {complaint.title}
                          </p>
                          <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {complaint.description}
                          </p>
                          <div className="text-sm text-gray-500">
                            <p>{complaint.category}</p>
                            <p>{new Date(complaint.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;