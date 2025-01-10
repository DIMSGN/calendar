import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom'; // Import Routes instead of Switch
import './App.css';
import EventList from './EventList'; // Import EventList component
import SideNav from './SideNav'; // Import SideNav component
import Settings from './Settings'; // Import Settings component
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/appointments');
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      alert('Failed to load events!');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (eventData, resetForm) => {
    try {
      await axios.post('http://localhost:3001/api/appointments', eventData);
      fetchEvents();
      resetForm();
    } catch (error) {
      console.error("Error creating event:", error);
      alert('Failed to create event.');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  };

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SideNav darkMode={darkMode} /> {/* Include SideNav component */}
      <div className="App" style={{ 
        marginLeft: '35%', /* Adjust margin to account for the sidebar */
        backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)', 
        color: darkMode ? 'white' : 'black', 
        minHeight: '100vh' 
      }}>
        <IconButton
          onClick={toggleDarkMode}
          color="inherit"
          style={{ marginBottom: '20px' }}
          sx={{
            color: darkMode ? 'orange' : 'inherit',
            border: '1px solid',
            borderColor: darkMode ? 'black' : 'black',
            borderRadius: '50%',
          }}
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <h1 style={{ color: darkMode ? 'white' : 'black' }}>Calendar App <CalendarTodayIcon /> </h1>
        <Routes>
          <Route path="/" element={
            <div>
              <h2 style={{ color: darkMode ? 'white' : 'black' }}>Create New Event</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const eventData = {
                  title: e.target.title.value,
                  description: e.target.description.value,
                  startDate: e.target.startDate.value,
                  endDate: e.target.endDate.value
                };
                handleCreateEvent(eventData, () => e.target.reset());
              }}>
                <input type="text" name="title" placeholder="Event Title" required style={{ backgroundColor: darkMode ? '#333' : 'white', color: darkMode ? 'white' : 'black' }} />
                <textarea name="description" placeholder="Event Description" required style={{ backgroundColor: darkMode ? '#333' : 'white', color: darkMode ? 'white' : 'black' }} />
                <input type="datetime-local" name="startDate" required style={{ backgroundColor: darkMode ? '#333' : 'white', color: darkMode ? 'white' : 'black' }} />
                <input type="datetime-local" name="endDate" required style={{ backgroundColor: darkMode ? '#333' : 'white', color: darkMode ? 'white' : 'black' }} />
                <button type="submit" style={{ 
                  backgroundColor: darkMode ? 'lightgreen' : '#007bff', 
                  color: darkMode ? 'black' : 'white', 
                  padding: '10px 20px', 
                  fontSize: '1rem', 
                  cursor: 'pointer', 
                  border: 'none', 
                  borderRadius: '5px', 
                  transition: 'background-color 0.3s ease, color 0.3s' 
                }}>Create Event</button>
              </form>
              <div>
                <h2 style={{ color: darkMode ? 'white' : 'black' }}>Upcoming Events</h2>
                {loading ? (
                  <p>Loading events...</p>
                ) : (
                  <EventList events={events} onEventUpdated={fetchEvents} darkMode={darkMode} />
                )}
              </div>
            </div>
          } />
          <Route path="/settings" element={<Settings darkMode={darkMode} />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;