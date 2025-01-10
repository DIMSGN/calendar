import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MenuIcon from '@mui/icons-material/Menu'; // Import MenuIcon
import './EventList.css'; // Import the CSS file

const useEventHandlers = (onEventUpdated) => {
  const [isEditing, setIsEditing] = useState(null);
  const [uploadingEventId, setUploadingEventId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [documentNames, setDocumentNames] = useState({});

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/appointments/${id}`);
      onEventUpdated();
    } catch (error) {
      console.error("Error deleting event:", error);
      alert('Failed to delete event.');
    }
  };

  const handleDeleteDocument = async (eventId, documentName) => {
    try {
      await axios.delete(`http://localhost:3001/api/appointments/${eventId}/documents/${documentName}`);
      fetchDocumentNames(eventId);
    } catch (error) {
      console.error("Error deleting document:", error);
      alert('Failed to delete document.');
    }
  };

  const handleEditEvent = (id) => {
    setIsEditing(id);
  };

  const handleSaveEdit = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:3001/api/appointments/${id}`, updatedData);
      setIsEditing(null);
      onEventUpdated();
    } catch (error) {
      console.error("Error saving event:", error);
      alert('Failed to save event.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
  };

  const handleUploadDocument = async (id) => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      const response = await axios.post(`http://localhost:3001/api/appointments/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadingEventId(null);
      setSelectedFile(null);
      onEventUpdated();
      fetchDocumentNames(id);
    } catch (error) {
      console.error("Error uploading document:", error);
      alert('Failed to upload document.');
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleShowUploadForm = (id) => {
    setUploadingEventId(id);
  };

  const handleCancelUpload = () => {
    setUploadingEventId(null);
    setSelectedFile(null);
  };

  const handleToggleExpand = (id) => {
    setExpandedEventId(expandedEventId === id ? null : id);
    if (expandedEventId !== id) {
      fetchDocumentNames(id);
    }
  };

  const fetchDocumentNames = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/appointments/${id}/documents`);
      setDocumentNames((prev) => ({ ...prev, [id]: response.data }));
    } catch (error) {
      console.error("Error fetching document names:", error);
    }
  };

  return {
    isEditing,
    uploadingEventId,
    expandedEventId,
    documentNames,
    handleDeleteEvent,
    handleEditEvent,
    handleSaveEdit,
    handleCancelEdit,
    handleUploadDocument,
    handleFileChange,
    handleShowUploadForm,
    handleCancelUpload,
    handleToggleExpand,
    handleDeleteDocument,
  };
};

const EventList = ({ events, onEventUpdated, darkMode }) => {
  const {
    isEditing,
    uploadingEventId,
    expandedEventId,
    documentNames,
    handleDeleteEvent,
    handleEditEvent,
    handleSaveEdit,
    handleCancelEdit,
    handleUploadDocument,
    handleFileChange,
    handleShowUploadForm,
    handleCancelUpload,
    handleToggleExpand,
    handleDeleteDocument,
  } = useEventHandlers(onEventUpdated);

  return (
    <div className={`event-list-container ${darkMode ? 'dark' : 'light'}`}>
      <h1 style={{ display: 'flex', alignItems: 'center', color: darkMode ? 'white' : 'black' }}>
        <MenuIcon style={{ marginRight: '10px', cursor: 'pointer', color: darkMode ? 'white' : 'black' }} /> {/* Add MenuIcon */}
        Event List
      </h1>
      <table className="event-table">
        <thead>
          <tr>
            <th className={darkMode ? 'dark' : ''}>Title</th>
            <th className={darkMode ? 'dark' : ''}>Description</th>
            <th className={darkMode ? 'dark' : ''}>Arrival</th>
            <th className={darkMode ? 'dark' : ''}>Departure</th>
            <th className={darkMode ? 'dark' : ''}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <React.Fragment key={event.id}>
              <tr className={darkMode ? 'dark' : ''}>
                {isEditing === event.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        defaultValue={event.title}
                        onChange={(e) => event.title = e.target.value}
                        className={darkMode ? 'dark' : ''}
                      />
                    </td>
                    <td>
                      <textarea
                        defaultValue={event.description}
                        onChange={(e) => event.description = e.target.value}
                        className={darkMode ? 'dark' : ''}
                      />
                    </td>
                    <td>
                      <input
                        type="datetime-local"
                        defaultValue={event.startDate}
                        onChange={(e) => event.startDate = e.target.value}
                        className={darkMode ? 'dark' : ''}
                      />
                    </td>
                    <td>
                      <input
                        type="datetime-local"
                        defaultValue={event.endDate}
                        onChange={(e) => event.endDate = e.target.value}
                        className={darkMode ? 'dark' : ''}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleSaveEdit(event.id)} style={{ backgroundColor: darkMode ? 'lightgreen' : '#007bff', color: darkMode ? 'black' : 'white' }}>Save</button>
                      <button onClick={handleCancelEdit} style={{ backgroundColor: darkMode ? 'lightgreen' : '#007bff', color: darkMode ? 'black' : 'white' }}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{event.title}</td>
                    <td>{event.description}</td>
                    <td>{new Date(event.startDate).toLocaleString()}</td>
                    <td>{new Date(event.endDate).toLocaleString()}</td>
                    <td>
                      <div className="button-group">
                        <button onClick={() => handleEditEvent(event.id)} className="edit-btn" style={{ backgroundColor: darkMode ? 'lightgreen' : '#007bff', color: darkMode ? 'black' : 'white' }}>Edit</button>
                        <button onClick={() => handleDeleteEvent(event.id)} style={{ backgroundColor: darkMode ? 'lightgreen' : '#007bff', color: darkMode ? 'black' : 'white' }}>Delete</button>
                        <button onClick={() => handleShowUploadForm(event.id)} style={{ backgroundColor: darkMode ? 'lightgreen' : '#007bff', color: darkMode ? 'black' : 'white' }}>
                          <i className="fas fa-paperclip"></i>
                        </button>
                        <button onClick={() => handleToggleExpand(event.id)} style={{ backgroundColor: darkMode ? 'lightgreen' : '#007bff', color: darkMode ? 'black' : 'white' }}>
                          <VisibilityIcon />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
              {expandedEventId === event.id && (
                <tr>
                  <td colSpan="5" className={darkMode ? 'dark' : ''}>
                    <div className="document-list">
                      {documentNames[event.id] && documentNames[event.id].length > 0 ? (
                        documentNames[event.id].map((doc, index) => (
                          <div key={index}>
                            <a href={`http://localhost:3001/${doc.path}`} target="_blank" rel="noopener noreferrer" style={{ color: darkMode ? 'lightgreen' : '#007bff' }}>
                              {doc.name}
                            </a>
                            <button onClick={() => handleDeleteDocument(event.id, doc.name)} className="delete-btn">
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        ))
                      ) : (
                        <p>No documents uploaded.</p>
                      )}
                      {uploadingEventId === event.id && (
                        <div className="upload-form">
                          <input type="file" onChange={handleFileChange} />
                          <button onClick={() => handleUploadDocument(event.id)} style={{ backgroundColor: darkMode ? 'lightgreen' : '#007bff', color: darkMode ? 'black' : 'white' }}>Upload</button>
                          <button onClick={handleCancelUpload} style={{ backgroundColor: darkMode ? 'lightgreen' : '#007bff', color: darkMode ? 'black' : 'white' }}>Cancel</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
              {uploadingEventId === event.id && (
                <tr>
                  <td colSpan="5" className={darkMode ? 'dark' : ''}>
                    <div className="upload-form">
                      <input type="file" onChange={handleFileChange} />
                      <button onClick={() => handleUploadDocument(event.id)} style={{ backgroundColor: darkMode ? 'lightgreen' : '#007bff', color: darkMode ? 'black' : 'white' }}>Upload</button>
                      <button onClick={handleCancelUpload} style={{ backgroundColor: darkMode ? 'lightgreen' : '#007bff', color: darkMode ? 'black' : 'white' }}>Cancel</button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventList;