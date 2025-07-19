import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Lobby from "./components/Lobby";
import ArticlesLayout from "./components/Article";

function App() {

  return (
    <>
      <Header />
      {/* <Lobby /> */}
      <ArticlesLayout />
      <main className="transition-all duration-300 ease-in-out">
        <AnimatePresence mode="wait">
          <Outlet key={Location.pathname}/> {/* This renders current page */}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  )
}

export default App