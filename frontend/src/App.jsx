import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {

  return (
    <>
      <Header />
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