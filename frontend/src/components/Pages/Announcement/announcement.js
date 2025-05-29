import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Announcement.css'; // Add your CSS here
import icon from './announcement.png';


const Announcement = () => {
  const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://technothlon.techniche.org.in/api/"
    : "http://localhost:3001/api/";

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}announcement`);
      setAnnouncements(response.data);
    } catch (err) {
      setError('Error fetching announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <section className="announcement-wrap">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-4">
            <div className="announ">
              <img
                src={icon}
                alt="Announcements"
              />
              <h4>Announcements</h4>
              <div id="contain" className="announ-scroll scroll custom-scroll">
                <div id="table_scroll">
                  {loading ? (
                    <p>Loading...</p>
                  ) : error ? (
                    <p>{error}</p>
                  ) : announcements.length > 0 ? (
                    announcements.map((item) => (
                      <p key={item._id}>
                        {item.content}
                        {item.link && (
                          <>
                            {' '}
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                              Click Here
                            </a>
                          </>
                        )}
                      </p>
                    ))
                  ) : (
                    <p>No announcements available</p>
                  )}
                </div>
              </div>
              {/* <p className="border-0">
                <a href="/ViewMoreAnnouncement"> View more</a>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Announcement;
