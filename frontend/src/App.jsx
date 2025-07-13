import React from 'react'
import { BrowserRouter , Routes , Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Footer from './components/Footer';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Ideas from './pages/Ideas';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { signoutSuccess, signInSuccess } from './redux/user/userSlice';


export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('tokenExpiry');
    if (token && expiry) {
      const timeLeft = Number(expiry) - Date.now();
      if (timeLeft > 0) {
        // Optionally, fetch user profile here and dispatch signInSuccess
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiry');
          dispatch(signoutSuccess());
        }, timeLeft);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        dispatch(signoutSuccess());
      }
    } else {
      dispatch(signoutSuccess());
    }
  }, [dispatch]);
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/ideas' element={<Ideas />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
