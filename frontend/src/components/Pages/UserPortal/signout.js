import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const SignOut = () => {
  const navigate = useNavigate();
  const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/api/" : "http://localhost:3001/api/";
  const redirectUrl = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/login" : "http://localhost:3000/login";
  useEffect(() => {
    axios.get(`${baseURL}uploadcsv/logout`)
      .then(res => {
        if (res.data.status) {
          localStorage.removeItem('token');
          localStorage.clear();
          
          window.location.href = redirectUrl;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [baseURL, redirectUrl]);

  return null;
};

export default SignOut;
