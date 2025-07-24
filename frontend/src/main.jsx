import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Routes, Route } from "react-router";

import Lobby from "./Pages/Lobby.jsx";
import ArticleLayout from "./components/Articles/ArticleLayout.jsx";
import VideoPage from "./Pages/video.jsx"

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<Lobby />}/>
        <Route path='articles' element={<ArticleLayout />}/>
        <Route path='media' element={<VideoPage />}/>
      </Route>
    </Routes>
  </BrowserRouter>,
);
