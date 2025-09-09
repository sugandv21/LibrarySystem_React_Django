import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Authors from "./pages/Authors";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/authors" element={<Authors />} />
            <Route path="*" element={<div className="p-6">Page not found</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
