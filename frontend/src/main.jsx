import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Routes, Route } from "react-router";

import Lobby from "./Pages/Lobby.jsx";
import ArticleLayout from "./Pages/ArticleLayout.jsx";
import VideoListPage from "./Pages/VideoListePage.jsx";
import About from "./Pages/About.jsx";
import Members from "./Pages/Members.jsx";
import Publications from "./Pages/Publications.jsx";
import Login from "./Pages/Login.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import ArticleView from "./Pages/ArticleView.jsx";
import VideoView from "./Pages/VideoView.jsx";
import Announcements from "./Pages/Announcements.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<Lobby />} />
        <Route path='articles' element={<ArticleLayout />} />
        <Route path='articles/:id' element={<ArticleView />} />
        <Route path='videos' element={<VideoListPage />} />
        <Route path='videos/:slug' element={<VideoView />} />
        <Route path='about' element={<About />} />
        <Route path='members' element={<Members />} />
        <Route path='publications' element={<Publications />} />
        <Route path='login' element={<Login />} />
        <Route path='admin' element={<AdminDashboard />} />
        <Route path='announcements' element={<Announcements />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
