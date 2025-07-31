import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Menu,
  X,
  Home,
  Calendar,
  Video,
  BookOpen,
  Settings,
  MessageCircle,
  LogOut,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: <Home size={18} />, path: "/" },
  {
    name: "Gallery Management",
    icon: <Calendar size={18} />,
    path: "/gallery",
    path2: "/album/:id",
  },
  { name: "Video Management", icon: <Video size={18} />, path: "/video" },
  {
    name: "Booking Management",
    icon: <BookOpen size={18} />,
    path: "/booking",
  },
  // {
  //   name: "Service Management",
  //   icon: <Settings size={18} />,
  //   path: "/service",
  // },
  {
    name: "Contact Messages",
    icon: <MessageCircle size={18} />,
    path: "/contact",
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleMenu = () => setOpen(!open);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // 🔐 Handle Logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      await axios.post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("auth_token");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden p-8 absolute z-50 flex justify-between items-start">
        {!open && (
          <button onClick={toggleMenu}>
            <Menu size={24} />
          </button>
        )}
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`h-[100vh] fixed z-40 bg-white w-66 md:w-[20rem] p-4 flex flex-col justify-between shadow-md transition-transform duration-300 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:flex`}
      >
        <div>
          {/* Mobile Close Icon */}
          <div className="md:hidden flex justify-end mb-4">
            <button onClick={toggleMenu}>
              <X size={24} />
            </button>
          </div>

          {/* Logo */}
          <div className="text-xl font-bold leading-tight px-4 mb-6 md:mt-5">
            <p>FX CREATIONS STUDIO</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-md text-md md:text-lg font-semibold hover:bg-orange-100 ${
                  location.pathname === item.path ||
                  (item.path2 &&
                    location.pathname.startsWith(item.path2.replace(":id", "")))
                    ? "bg-orange-400 text-white"
                    : "text-black"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Detail + Logout */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-medium text-sm">SKSINTHU</span>
          </div>
          <button onClick={handleLogout} title="Logout">
            <LogOut
              className="text-orange-500 hover:text-orange-700 cursor-pointer"
              size={20}
            />
          </button>
        </div>
      </div>
    </>
  );
}
