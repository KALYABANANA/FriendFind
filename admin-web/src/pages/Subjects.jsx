import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/admin';

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const fetchSubjects = () => {
    axios.get(`${API_URL}/subjects`)
      .then(res => setSubjects(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      axios.delete(`${API_URL}/subjects/${id}`)
        .then(() => fetchSubjects())
        .catch(err => alert("Error deleting subject. It might be in use."));
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!code || !name) return alert("Please fill all fields");
    
    axios.post(`${API_URL}/subjects`, { subject_code: code, subject_name: name })
      .then(() => {
        setCode('');
        setName('');
        fetchSubjects();
      })
      .catch(err => alert("Error adding subject"));
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Subject Management</h1>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Add New Subject</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Code</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. 1101105" 
              value={code} 
              onChange={e => setCode(e.target.value)} 
            />
          </div>
          <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Name</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Computer Programming" 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: 42 }}>
            <Plus size={16} /> Add Subject
          </button>
        </form>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Enrolled Users</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(subject => (
                <tr key={subject.id}>
                  <td>{subject.id}</td>
                  <td><strong>{subject.subject_code}</strong></td>
                  <td>{subject.subject_name}</td>
                  <td>{subject.enrolled_count} Users</td>
                  <td>
                    <button onClick={() => handleDelete(subject.id)} className="btn btn-danger">
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {subjects.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>No subjects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
