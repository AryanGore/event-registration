require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const Event = require('./models/Event');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Seed Events if none exist
const seedEvents = async () => {
  try {
    const count = await Event.countDocuments();
    if (count === 0) {
      console.log('Seeding events...');
      await Event.insertMany([
        { 
          title: 'Tech Conference 2026', 
          description: 'A global conference focusing on AI and Web Development.', 
          date: new Date('2026-08-15T09:00:00Z'), 
          location: 'San Francisco, CA', 
          imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
          capacity: 500 
        },
        { 
          title: 'Music Festival', 
          description: 'Outdoor live music featuring top indie bands.', 
          date: new Date('2026-09-20T17:00:00Z'), 
          location: 'Austin, TX', 
          imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
          capacity: 2000 
        },
        { 
          title: 'React Meetup', 
          description: 'Local meetup for React developers to network and share ideas.', 
          date: new Date('2026-07-10T18:30:00Z'), 
          location: 'New York, NY', 
          imageUrl: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800&q=80',
          capacity: 100 
        },
        { 
          title: 'Startup Pitch Night', 
          description: 'Watch early stage startups pitch to angel investors.', 
          date: new Date('2026-06-25T19:00:00Z'), 
          location: 'Chicago, IL', 
          imageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80',
          capacity: 150 
        }
      ]);
      console.log('Events seeded!');
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event-registration')
.then(() => {
  console.log('MongoDB connected');
  seedEvents();
})
.catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
