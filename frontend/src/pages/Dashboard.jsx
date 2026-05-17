import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';

const Dashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRegistrations = async () => {
    try {
      const res = await axios.get('/api/events/user/registrations');
      setRegistrations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  if (loading) return <div className="page-header"><h2>Loading Dashboard...</h2></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome, {user.username}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Here are the events you are registered for.</p>
      </div>

      {registrations.length === 0 ? (
        <div className="glass" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No registrations found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Head over to the events page to find something exciting!</p>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {registrations.map(reg => (
            <EventCard 
              key={reg.event._id} 
              event={reg.event} 
              isRegistered={true}
              onStatusChange={fetchRegistrations}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
