import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 text-center py-4 mt-auto border-t">
      <p className="text-sm">
        © {new Date().getFullYear()} Simple Library System. All rights reserved.
      </p>
    </footer>
  );
}
