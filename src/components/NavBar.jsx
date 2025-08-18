import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="bg-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-gray-800 text-xl font-bold">
          PDF Extractor
        </NavLink>
        <div className="flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-semibold border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`
            }
          >
            Online OCR
          </NavLink>
          <NavLink
            to="/auth"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-semibold border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`
            }
          >
            Try API
          </NavLink>
        </div>
      </div>
    </nav>
  );
}