import React from 'react';
import logo from './logo.svg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RequiredAuth from './components/RequiredAuth';
import AuthProvider from './providers/AuthProvider';
import ProfilePage from './components/ProfilePage';

function App() {
  return (
    //TODO: Stretch Goals: add routing to liked posts, a differnet feed (like mutual friends)
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<h1>Login Page</h1>} />
          <Route path="/signup" element={<h1>Signup Page</h1>} />
          <Route element={<RequiredAuth />}>
            <Route path="/" element={<h1>Home Page - Protected</h1>} />
            <Route path="/posts/:id" element={<h1>Post Detail Page - Protected</h1>} />
            <Route path="/create-post" element={<h1>Create Post Page - Protected</h1>} />
            <Route path="/edit-post/:id" element={<h1>Edit Post Page - Protected</h1>} />
            <Route path='/profile'>
              <Route path='me'>
                <Route index element={<h1>My Profile Page - Protected</h1>} />
                <Route path='edit' element={<h1>Edit My Profile Page - Protected</h1>} />
                <Route path='followers' element={<h1>My Followers Page - Protected</h1>} />
                <Route path='following' element={<h1>My Following Page - Protected</h1>} />
              </Route>
              <Route path=':username' element={<ProfilePage/>} />
              <Route path=':username/followers' element={<h1>Other User Followers Page - Protected</h1>} />
              <Route path=':username/following' element={<h1>Other User Following Page - Protected</h1>} />
            </Route>


          </Route>


        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
