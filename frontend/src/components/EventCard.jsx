import { Calendar, MapPin, Users } from 'lucide-react';
import axios from 'axios';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event, isRegistered, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    numberOfAttendees: 1
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowForm(true);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`/api/events/${event._id}/register`, formData);
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '', numberOfAttendees: 1 });
      if (onStatusChange) onStatusChange();
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your registration?')) return;
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/events/${event._id}/unregister`);
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

        {isRegistered ? (
          <button 
            className="btn" 
            style={{ width: '100%', backgroundColor: '#dc3545', color: 'white' }}
            onClick={handleCancel}
            disabled={loading}
          >
            {loading ? 'Cancelling...' : 'Cancel Registration'}
          </button>
        ) : !showForm ? (
          <button 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            onClick={handleRegisterClick}
          >
            Register Now
          </button>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Enter Registration Details</h4>
            <input 
              type="text" 
              name="name" 
              placeholder="Primary Contact Name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <input 
              type="number" 
              name="numberOfAttendees" 
              placeholder="Number of Attendees" 
              value={formData.numberOfAttendees} 
              onChange={handleChange} 
              min="1"
              required 
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              <button type="button" className="btn" style={{ flex: 1, backgroundColor: '#6c757d' }} onClick={() => setShowForm(false)}>
                Go Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EventCard;
