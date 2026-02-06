// src/App.tsx
import React from 'react';
import logo from './logo.svg';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import RequiredAuth from './components/RequiredAuth';
import AuthProvider from './providers/AuthProvider';
import ProfilePage from './components/ProfilePage';
import Login from "./components/Login";
import Register from "./components/Register";
import EditProfilePage from './components/EditProfilePage';
import CreateProfilePage from './components/CreateProfilePage';
import PostPage from "./pages/PostPage";
import Navbar from './components/Navbar';
import PostDetailPage from "./pages/PostDetailPage";

function App() {
  return (
    //TODO: Stretch Goals: add routing to liked posts, a differnet feed (like mutual friends)
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route element={<RequiredAuth />}>
            <Route path="/" element={<PostPage />} />
            <Route path="/create-profile" element={<CreateProfilePage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/create-post" element={<h1>Create Post Page - Protected</h1>} />
            <Route path="/edit-post/:id" element={<h1>Edit Post Page - Protected</h1>} />
            <Route path='/profile'>
              <Route path='me' element={<ProfilePage />} />
              <Route path='me/edit' element={<EditProfilePage />} />
              <Route path='me/followers' element={<h1>My Followers Page - Protected</h1>} />
              <Route path='me/following' element={<h1>My Following Page - Protected</h1>} />
              <Route path=':username' element={<ProfilePage />} />
              <Route path=':username/followers' element={<h1>Other User Followers Page - Protected</h1>} />
              <Route path=':username/following' element={<h1>Other User Following Page - Protected</h1>} />
            </Route>
          </Route>
          {/* default / unknown -> show login first */}
          <Route path="*" element={<Navigate to="/login" />} /> {/* catch all unmatched routes and redirect to login */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
