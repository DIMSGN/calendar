import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SettingsIcon from '@mui/icons-material/Settings'; // Import SettingsIcon
import './SideNav.css'; // Import the CSS file for additional styling

const SideNav = ({ darkMode }) => {
  const [visible, setVisible] = useState(false);

  const toggleNav = () => {
    setVisible(!visible);
  };

  return (
    <>
      <IconButton onClick={toggleNav} style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 1100, cursor: 'pointer', color: darkMode ? 'white' : 'black' }}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={visible} onClose={toggleNav}>
        <div className={`side-nav ${visible ? 'visible' : ''} ${darkMode ? 'dark' : 'light'}`} role="presentation" onClick={toggleNav} onKeyDown={toggleNav}>
          <List>
            <ListItem button component={Link} to="/">
              <ListItemIcon><HomeIcon className="icon" style={{ color: darkMode ? 'green' : 'inherit' }} /></ListItemIcon>
              <ListItemText primary="Home" className="text" style={{ color: darkMode ? 'white' : 'inherit' }} />
            </ListItem>
            <Divider />
            <ListItem button component={Link} to="/about">
              <ListItemIcon><InfoIcon className="icon" style={{ color: darkMode ? 'green' : 'inherit' }} /></ListItemIcon>
              <ListItemText primary="About" className="text" style={{ color: darkMode ? 'white' : 'inherit' }} />
            </ListItem>
            <Divider />
            <ListItem button component={Link} to="/contact">
              <ListItemIcon><ContactMailIcon className="icon" style={{ color: darkMode ? 'green' : 'inherit' }} /></ListItemIcon>
              <ListItemText primary="Contact" className="text" style={{ color: darkMode ? 'white' : 'inherit' }} />
            </ListItem>
            <Divider />
            <ListItem button component={Link} to="/settings">
              <ListItemIcon><SettingsIcon className="icon" style={{ color: darkMode ? 'green' : 'inherit' }} /></ListItemIcon>
              <ListItemText primary="Settings" className="text" style={{ color: darkMode ? 'white' : 'inherit' }} />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default SideNav;