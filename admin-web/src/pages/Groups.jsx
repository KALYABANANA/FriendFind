import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/admin';

export default function Groups() {
  const [groups, setGroups] = useState([]);

  const fetchGroups = () => {
    axios.get(`${API_URL}/groups`)
      .then(res => setGroups(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this study group?")) {
      axios.delete(`${API_URL}/groups/${id}`)
        .then(() => fetchGroups())
        .catch(err => alert("Error deleting group"));
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Study Group Management</h1>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Subject</th>
                <th>Creator</th>
                <th>Members</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map(group => (
                <tr key={group.id}>
                  <td>{group.id}</td>
                  <td><strong>{group.title}</strong></td>
                  <td>{group.subject_code} - {group.subject_name}</td>
                  <td>{group.creator_name}</td>
                  <td>{group.current_members} / {group.member_limit || '∞'}</td>
                  <td>
                    <button onClick={() => handleDelete(group.id)} className="btn btn-danger">
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {groups.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>No groups found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
