import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, BookOpen, UsersRound } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/admin';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalGroups: 0, totalSubjects: 0 });

  useEffect(() => {
    axios.get(`${API_URL}/dashboard`)
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Subjects</h3>
            <p>{stats.totalSubjects}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon">
            <UsersRound size={24} />
          </div>
          <div className="stat-info">
            <h3>Study Groups</h3>
            <p>{stats.totalGroups}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
