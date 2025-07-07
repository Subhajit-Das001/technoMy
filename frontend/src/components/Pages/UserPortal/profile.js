import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';
import techno from "../../Assets/techno-owl.png";
const Profile = () => {
  const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/api/" : "http://localhost:3001/api/";
  const redirectUrl = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/" : "http://localhost:3000/";
  const [user, setUser] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [email1, setEmail1] = useState('');
  const [contact1, setContact1] = useState('');
  const [email2, setEmail2] = useState('');
  const [contact2, setContact2] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}uploadcsv/user`, {
          withCredentials: true
        });
        setUser(response.data.user);
        setEmail1(response.data.user.email1);
        setContact1(response.data.user.contact1);
        setEmail2(response.data.user.email2);
        setContact2(response.data.user.contact2);
      } catch (err) {
        console.log('Error fetching user details:', err);
      }
    };

    fetchUserDetails();
  }, []);

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
    } else {
      try {
        await axios.post(`${baseURL}uploadcsv/change-password`, {
          roll: user.roll||user.rollNumber,
          oldPassword,
          newPassword
        }, {
          withCredentials: true
        });
        alert("Password changed successfully");
        setError('');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (err) {
        console.error('Error changing password:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'Error changing password');
      }
    }
  };

  const handleUpdateDetails = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${baseURL}uploadcsv/update-details`, {
        roll: user.roll||user.rollNumber,
        email1,
        contact1,
        email2,
        contact2
      }, {
        withCredentials: true
      });
      alert('Details updated successfully');
      setUpdateError('');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating details:', err.response?.data?.message || err.message);
      setUpdateError(err.response?.data?.message || 'Error updating details');
      setSuccessMessage('');
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setUpdateError('');
    setSuccessMessage('');
  };

  const handleSaveClick = (event) => {
    handleUpdateDetails(event);
  };

  return (
    <div className="Profile-main">
      <div className="roll"><p>{user.roll||user.rollNumber}</p><img src={techno} alt="" /></div>
      <div className='profile-heading'>Profile</div>
      <div className="profile">
        <div className="reg-details">
          <div className="reg-head">Registration Details: {user.roll||user.rollNumber}</div>
          <div className='user-details-wrapper'>
            <div className="part-1">
              <p><b>Participant1 Name: {user.name1}</b></p>
              {isEditing ? (
                <>
                  <div className="editable-field">
                    <b>Email1:</b>
                    <input
                      type="email"
                      value={email1}
                      onChange={(e) => setEmail1(e.target.value)}
                    />
                  </div>
                  <div className="editable-field">
                    <b>Contact1:</b>
                    <input
                      type="text"
                      value={contact1}
                      onChange={(e) => setContact1(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <p><b>Email1: {email1}</b></p>
                  <p><b>Contact1: {contact1}</b></p>
                </>
              )}
            </div>
            <div className="part-2">
              <p><b>Participant2 Name: {user.name2}</b></p>
              {isEditing ? (
                <>
                  <div className="editable-field">
                    <b>Email2:</b>
                    <input
                      type="email"
                      value={email2}
                      onChange={(e) => setEmail2(e.target.value)}
                    />
                  </div>
                  <div className="editable-field">
                    <b>Contact2:</b>
                    <input
                      type="text"
                      value={contact2}
                      onChange={(e) => setContact2(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <p><b>Email2: {email2}</b></p>
                  <p><b>Contact2: {contact2}</b></p>
                </>
              )}
            </div>
          </div>
          {isEditing ? (
            <button 
              onClick={handleSaveClick}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1.2rem',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(34, 52, 56, 0.08)'
              }}
            >
              Save
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button 
                onClick={handleEditClick}
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1.2rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(34, 52, 56, 0.08)'
                }}
              >
                Update Info
              </button>
              <span style={{ color: 'red', fontWeight: 500, fontSize: '1.08rem',  }}>
                Update your email and phone number in the 'Update Info' section. Both teammates must provide correct and unique details to receive contest updates, admit cards, and certificates.
              </span>
            </div>
          )}
        </div>
        <div className='pwd-change-wrapper'>
          <div className='pwd-change-heading'>Change Password</div>
          <div className='pwd-change-form'>
            <form onSubmit={handlePasswordChange}>
              <label htmlFor="oldPassword"></label>
              <input
                type="password"
                id="oldPassword"
                placeholder='Enter your Old Password'
                name="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <label htmlFor="newPassword"></label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder='Enter your New Password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <label htmlFor="confirmPassword"></label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder='Confirm New Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {error && <div>{error}</div>}
              <div className='submit-btn-wrapper'>
                <button className='pwd-change-btn' type="submit">Change Password</button>
              </div>
            </form>
          </div>
        </div>
        {updateError && <div className='error-message'>{updateError}</div>}
        {successMessage && <div className='success-message'>{successMessage}</div>}
      </div>
    </div>
  );
};

export default Profile;
