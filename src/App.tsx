import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import RequiredAuth from "./components/RequiredAuth";
import AuthProvider from "./providers/AuthProvider";
import Login from "./components/Login";
import Register from "./components/Register";
import PostPage from "./pages/PostPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />

          {/* Protected routes */}
          <Route element={<RequiredAuth />}>
            <Route path="/" element={<h1>Home Page - Protected</h1>} />
            <Route path="/posts" element={<PostPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
