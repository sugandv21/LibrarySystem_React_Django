import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-pink-600 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-2xl">Library</Link>
      <div className="space-x-4">
        <Link to="/" className="font-semibold text-xl">Home</Link>
        <Link to="/books" className="font-semibold text-xl">Books</Link>
        <Link to="/authors" className="font-semibold text-xl">Authors</Link>
      </div>
    </nav>
  );
}
