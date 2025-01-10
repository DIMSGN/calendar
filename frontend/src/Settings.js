import React from 'react';

const Settings = ({ darkMode, toggleDarkMode, language, setLanguage }) => {
  return (
    <div className={`settings-container ${darkMode ? 'dark' : 'light'}`}>
      <h2>Settings</h2>
      <div>
        <label>
          <input 
            type="checkbox" 
            checked={darkMode} 
            onChange={toggleDarkMode} 
          />
          Dark Mode
        </label>
      </div>
      <div>
        <label>
          Language:
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)} 
            style={{ marginLeft: '10px', backgroundColor: darkMode ? '#333' : 'white', color: darkMode ? 'white' : 'black' }}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default Settings;