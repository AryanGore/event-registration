import { Calendar, MapPin, Users } from 'lucide-react';
import axios from 'axios';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event, isRegistered, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (isRegistered) {
        await axios.delete(`/api/events/${event._id}/unregister`);
      } else {
        await axios.post(`/api/events/${event._id}/register`);
      }
      if (onStatusChange) onStatusChange();
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="glass">
      <div className="card-img-wrapper">
        <img src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} alt={event.title} className="card-img" />
      </div>
      <div className="card-body">
        <h3 className="card-title">{event.title}</h3>
        <p className="card-text">{event.description}</p>
        
        {error && <div className="error-msg" style={{ padding: '0.25rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} /> {formattedDate}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} /> {event.location}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} /> Capacity: {event.capacity}
          </div>
        </div>

        <button 
          className={`btn ${isRegistered ? 'btn-danger' : 'btn-primary'}`} 
          style={{ width: '100%' }}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? 'Processing...' : (isRegistered ? 'Unregister' : 'Register Now')}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
