import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default App;
