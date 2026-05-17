import { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const eventsRes = await axios.get('/api/events');
      setEvents(eventsRes.data);

      if (user) {
        const regRes = await axios.get('/api/events/user/registrations');
        setRegistrations(regRes.data.map(r => r.event._id || r.event));
      } else {
        setRegistrations([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) {
    return <div className="page-header"><h2>Loading Events...</h2></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Discover Upcoming Events</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Explore and register for the best tech conferences, music festivals, and networking meetups around the world.
        </p>
      </div>
      
      <div className="grid grid-cols-3">
        {events.map(event => (
          <EventCard 
            key={event._id} 
            event={event} 
            isRegistered={registrations.includes(event._id)}
            onStatusChange={fetchData}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
