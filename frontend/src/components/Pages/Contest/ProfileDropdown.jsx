import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getLocalUser = () => {
  try {
    const userObjStr = localStorage.getItem('user') || localStorage.getItem('student') || '{}';
    const userObj = JSON.parse(userObjStr);
    if (userObj && Object.keys(userObj).length > 0) {
      return {
        name: userObj.name || userObj.userName || localStorage.getItem('userName') || '',
        mobile: userObj.mobile || userObj.phone || localStorage.getItem('userPhone') || localStorage.getItem('mobile') || '',
        school: userObj.school || userObj.college || localStorage.getItem('userSchool') || '',
      };
    }
  } catch (e) {
  }

  return {
    name: localStorage.getItem('userName') || localStorage.getItem('name') || localStorage.getItem('studentName') || '',
    mobile: localStorage.getItem('userPhone') || localStorage.getItem('mobile') || localStorage.getItem('phone') || '',
    school: localStorage.getItem('userSchool') || localStorage.getItem('school') || localStorage.getItem('college') || '',
  };
};

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(getLocalUser);

  useEffect(() => {
    setUser(getLocalUser());
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/contest/login', { replace: true });
  };

  const hasUserData = user.name || user.mobile;

  return (
    // Added flex-none and min-w-[48px] to guarantee the parent never squishes it
    <div ref={wrapperRef} className="relative flex-none min-w-[48px] z-[9999]">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex-none min-w-[48px] min-h-[48px] w-12 h-12 flex items-center justify-center rounded-full bg-slate-950 text-white shadow-xl shadow-sky-200/50 transition hover:-translate-y-0.5 hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        aria-label="Open profile menu"
      >
        {/* Bulletproof SVG */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-6 h-6 text-white"
        >
          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 origin-top-right w-72 rounded-2xl bg-white p-5 text-left shadow-2xl shadow-slate-300/50 ring-1 ring-slate-100">
          {!hasUserData ? (
            <div>
              <p className="text-sm font-black text-rose-600">Profile unavailable</p>
              <p className="mt-1 text-xs font-semibold text-slate-500 whitespace-normal">
                Please log in again to load your details.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-lg font-black text-slate-900 break-words leading-tight" title={user.name}>
                {user.name || 'Mega Contest User'}
              </p>
              
              <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
                <p className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <span aria-hidden="true" className="text-base flex-none">📱</span> 
                  <span className="font-mono tracking-wide truncate">{user.mobile || 'No contact provided'}</span>
                </p>
                <p className="flex items-center gap-2 text-sm font-medium text-slate-600" title={user.school}>
                  <span aria-hidden="true" className="text-base flex-none">🏫</span> 
                  <span className="truncate">{user.school || 'School not provided'}</span>
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 w-full rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-2.5 text-sm font-black uppercase tracking-wider text-rose-600 transition hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;