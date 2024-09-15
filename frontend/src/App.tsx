import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import './App.css';
import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from './service/api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | undefined>(undefined);

  const { data, isPending } = useQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
  });

  useEffect(() => {
    if (data && data.id && data.username) {
      setIsLoggedIn(true);
      setUsername(data.username);
    }
  }, [data]);

  return (
    <>
      <Router>
        <Header isLoggedIn={isLoggedIn} username={username} />
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} loadingUserInfo={isPending} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
      <ToastContainer autoClose={3000} position="top-center" theme="colored"/>
    </>
  );
}

export default App;
