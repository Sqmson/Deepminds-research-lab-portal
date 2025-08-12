import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Outlet />
            </AnimatePresence>
          </main>
          <Footer />
        </div>
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#4aed88',
              },
            },
            error: {
              duration: 5000,
              theme: {
                primary: '#f56565',
              },
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
