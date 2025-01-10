import React from 'react';

const Settings = ({ darkMode }) => {
  return (
    <div style={{ padding: '20px', color: darkMode ? 'white' : 'black' }}>
      <h2 style={{ color: darkMode ? 'white' : 'black' }}>Settings</h2>
      <p style={{ color: darkMode ? 'white' : 'black' }}>Here you can configure your settings.</p>
    </div>
  );
};

export default Settings;