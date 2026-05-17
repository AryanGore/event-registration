import { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';
import { CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  if (loading) {
    return <div className="page-header"><h2>Loading Your Events...</h2></div>;
  }

  return (
    <div>
      <div className="page-header" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--glass-bg)', padding: '1rem', borderRadius: '50%', border: '1px solid var(--border-color)' }}>
          <CalendarCheck size={32} color="var(--primary-color)" />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Hello, {user?.name}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Here are the events you are registered for.</p>
        </div>
      </div>
      
      {registrations.length === 0 ? (
        <div className="glass" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '1rem' }}>No events found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You haven't registered for any events yet.</p>
          <Link to="/" className="btn btn-primary">Browse Events</Link>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {registrations.map(reg => (
            <EventCard 
              key={reg._id} 
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
