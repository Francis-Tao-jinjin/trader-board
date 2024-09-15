import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../service/api';
import { toast } from 'react-toastify';

const Header: React.FC<{ isLoggedIn: boolean; username?: string }> = ({ isLoggedIn, username }) => {

  const logOut = async () => {
    try {
      await logout();
      setTimeout(() => {
        window.location.pathname = '/';
      }, 500)
    } catch (err) {
      toast.error('Something went wrong');
      console.error(err);
    }
  }

  return (
    <div className='flex justify-between items-center p-4 bg-gray-800 text-white'>
      <h1 className='text-xl'>Trader Board</h1>
      <nav className='flex gap-4'>
        {isLoggedIn ? (
          <>
            <span>{username}</span>
            <button onClick={logOut}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Header;