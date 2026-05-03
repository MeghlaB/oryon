
import { useCallback, useContext, useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaBolt,
  FaUserCircle,
  FaDesktop,
  FaLaptop,
  FaMobileAlt,
  FaTabletAlt,
  FaCamera,
  FaServer,
  FaKeyboard,
  FaGamepad,
  FaTv,
  FaHome,
  FaBatteryFull,
  FaChevronDown,
} from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import { MdLogout, MdAccountCircle, MdMonitor } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { RiGamepadLine } from "react-icons/ri";
import { GiPowerGenerator } from "react-icons/gi";
import userAdmin from "../../Hooks/userAdmin";
import userSeller from "../../Hooks/userSeller";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin] = userAdmin();
  const [isseller] = userSeller();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const profileRef = useRef();
  const searchRef = useRef();

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Cart state
  const [cartCount, setCartCount] = useState(0);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get cart data from localStorage
  useEffect(() => {
    const loadCartCount = () => {
      if (user?.email) {
        try {
          const cartData = localStorage.getItem(`cart_${user.email}`);
          if (cartData) {
            const cartItems = JSON.parse(cartData);
            const count = cartItems.reduce((total, item) => total + item.quantity, 0);
            setCartCount(count);
          } else {
            setCartCount(0);
          }
        } catch (error) {
          console.error('Error loading cart data:', error);
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    // Load initial cart count
    loadCartCount();

    // Listen for storage events (changes from other tabs/windows)
    const handleStorageChange = (e) => {
      if (user?.email && e.key === `cart_${user.email}`) {
        loadCartCount();
      }
    };

    // Listen for custom events (changes in the same tab)
    const handleCartUpdated = () => {
      loadCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdated);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, [user]);

  // Get dashboard link based on role
  const getDashboardLink = useCallback(() => {
    if (isAdmin) {
      return "/dashboard/adminhome";
    }
    if (isseller) {
      return "/dashboard/sellerhome";
    }
    return "/dashboard/user-home";
  }, [isAdmin, isseller]);

  // Debounced search suggestions
  const fetchSearchSuggestions = debounce(async (query) => {
    if (query.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    try {
      // This would be replaced with your actual API call
      // For now, we'll use a mock implementation
      const mockSuggestions = [
        `${query} laptop`,
        `${query} phone`,
        `${query} accessories`,
        `${query} gaming`
      ];
      setSearchSuggestions(mockSuggestions);
      setShowSearchSuggestions(true);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
    }
  }, 300);

  // Simple debounce implementation
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchSearchSuggestions(value);
  };

  // Search handler
  const handleSearch = (suggestion = null) => {
    const q = suggestion || searchTerm.trim();
    if (!q) return;

    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchTerm("");
    setShowSearchSuggestions(false);
    setMenuOpen(false);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    handleSearch(suggestion);
  };

  // Categories with icons
  const categories = [
    { name: "Home", path: "/", icon: <FaHome className="text-lg" /> },
    {
      name: "Desktop",
      path: "/desktop",
      icon: <FaDesktop className="text-lg" />,
    },
    { name: "Laptop", path: "/laptop", icon: <FaLaptop className="text-lg" /> },
    {
      name: "Monitor",
      path: "/monitor",
      icon: <MdMonitor className="text-lg" />,
    },
    {
      name: "UPS",
      path: "/ups",
      icon: <GiPowerGenerator className="text-lg" />,
    },
    {
      name: "Phone",
      path: "/phone",
      icon: <FaMobileAlt className="text-lg" />,
    },
    {
      name: "Tablet",
      path: "/tablet",
      icon: <FaTabletAlt className="text-lg" />,
    },
    { name: "Camera", path: "/camera", icon: <FaCamera className="text-lg" /> },
    {
      name: "Server & Storage",
      path: "/server-storage",
      icon: <FaServer className="text-lg" />,
    },
    {
      name: "Accessories",
      path: "/accessories",
      icon: <FaKeyboard className="text-lg" />,
    },
    {
      name: "Gadget",
      path: "/gadget",
      icon: <FaBatteryFull className="text-lg" />,
    },
    {
      name: "Gaming",
      path: "/gaming",
      icon: <RiGamepadLine className="text-lg" />,
    },
    { name: "TV", path: "/tv", icon: <FaTv className="text-lg" /> },
  ];

  // Check if current path is active
  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setShowDropdown(false);
      setMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="fixed top-0 z-50 w-full shadow-md">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 text-white bg-gradient-to-r from-blue-900 to-purple-900">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 transition-transform hover:scale-105"
          onClick={() => setMenuOpen(false)}
        >
          <img
            className="h-10 rounded-lg"
            src="https://i.ibb.co/7Jp64HMt/Whats-App-Image-2025-05-19-at-01-03-05-a47959b3.jpg"
            alt="TechShop Logo"
          />
        </Link>

        {/* Search Bar - Desktop with suggestions */}
        <div
          className="relative flex-1 hidden max-w-2xl mx-6 md:flex"
          ref={searchRef}
        >
          <div className="relative flex w-full">
            <input
              type="text"
              placeholder="Search products, brands, and categories..."
              className="w-full px-4 py-3 text-gray-800 outline-none rounded-l-md focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() =>
                searchTerm.length >= 2 && setShowSearchSuggestions(true)
              }
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="flex items-center justify-center px-5 transition-colors bg-blue-600 hover:bg-blue-700 rounded-r-md"
              onClick={() => handleSearch()}
              aria-label="Search"
            >
              <FaSearch className="text-lg text-white" />
            </button>
          </div>

          {/* Search suggestions dropdown */}
          {showSearchSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 z-50 mt-12 bg-white border border-gray-200 rounded-md shadow-lg">
              {searchSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-center px-4 py-3 text-gray-800 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <FaSearch className="mr-2 text-gray-500" />
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Icons */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Happy Hour */}
              <div className="">
                <button
                  onClick={() => {
                    logOut();
                    setShowDropdown(false);
                  }}
                  className="items-center hidden w-full px-4 py-2 text-sm font-semibold text-white transition-all rounded-md shadow-md md:flex hover:from-purple-700 hover:to-blue-700 hover:shadow-lg"
                >
                  <MdLogout className="mr-2" />
                  Sign Out
                </button>
              </div>

              {/* Cart with badge */}
              <Link
                to="/dashboard/my-carts"
                className="relative flex items-center p-2 transition-colors rounded-full hover:bg-white/10"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-600 rounded-full -top-1 -right-1">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Dashboard Link */}
              <Link
                to={getDashboardLink()}
                className="items-center hidden gap-1 p-2 transition-colors rounded-full md:flex hover:bg-white/10"
                aria-label="Dashboard"
              >
                <LuLayoutDashboard className="w-5 h-5" />
              </Link>

              {/* Profile Dropdown - Desktop */}
              <div className="relative hidden md:block" ref={profileRef}>
                <div
                  className="flex items-center gap-2 p-1 transition-colors rounded-full cursor-pointer hover:bg-white/10"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <img
                    src={user?.photoURL || "/default-avatar.png"}
                    alt="Profile"
                    className="w-8 h-8 border-2 border-white rounded-full"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXIiPjxwYXRoIGQ9Ik0xOSAyMXYtMmE0IDQgMCAwIDAtNC00SDlhNCA0IDAgMCAwLTQgNHYyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ii8+PC9zdmc+";
                    }}
                  />
                  <span className="text-sm font-medium max-w-[80px] truncate">
                    {user.displayName?.split(" ")[0] || "User"}
                  </span>
                  <FaChevronDown
                    className={`text-xs transition-transform ${showDropdown ? "rotate-180" : ""
                      }`}
                  />
                </div>

                {showDropdown && (
                  <div className="absolute right-0 z-50 w-48 py-2 mt-2 text-gray-800 bg-white rounded-md shadow-lg">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium truncate">
                        Hello, {user.displayName?.split(" ")[0] || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="items-center hidden gap-1 transition-colors cursor-pointer md:flex hover:text-yellow-300">
                <FaBolt className="text-yellow-400" />
                <span className="text-sm font-medium">Happy Hour</span>
              </div>
              <Link
                to={"/account/login"}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-all rounded-md shadow-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
              >
                <FaUserCircle />
                Sign In
              </Link>
            </div>
          )}

          {/* PC Builder Button */}
          <Link
            to="/pc-builder"
            className="hidden px-4 py-2 text-sm font-semibold text-white transition-all rounded-md shadow-md md:block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg"
          >
            PC Builder
          </Link>

          {/* Mobile Search Button */}
          <button
            className="p-2 text-xl transition-colors rounded-full md:hidden hover:bg-white/10"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Search"
          >
            <FaSearch />
          </button>

          {/* Mobile Profile and Menu */}
          <div className="flex items-center gap-2 md:hidden">
            {user && (
              <div className="relative" ref={profileRef}>
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="profile"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-8 h-8 border-2 border-white rounded-full cursor-pointer"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXIiPjxwYXRoIGQ9Ik0xOSAyMXYtMmE0IDQgMCA0IDAgMC00LTQgNEg5YTQgNCAwIDAgMC00IDR2MiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIvPjwvc3ZnPg==";
                  }}
                />
                {showDropdown && (
                  <div className="absolute right-0 z-50 py-2 mt-2 text-black bg-white rounded-md shadow-md w-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium">
                        Hello, {user.displayName?.split(" ")[0] || "User"}
                      </p>
                    </div>
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center px-4 py-2 text-sm transition-colors hover:bg-gray-200"
                      onClick={() => setShowDropdown(false)}
                    >
                      <LuLayoutDashboard className="mr-2" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-left transition-colors hover:bg-gray-100"
                    >
                      <MdLogout className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-xl transition-colors rounded-full hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {menuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Only shown when menu is open on mobile */}
      {menuOpen && (
        <div
          className="px-4 py-3 bg-white border-b border-gray-200 md:hidden"
          ref={searchRef}
        >
          <div className="relative flex">
            <input
              type="text"
              placeholder="Search products, brands, and categories..."
              className="w-full px-4 py-2 text-gray-800 border border-gray-300 outline-none rounded-l-md focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() =>
                searchTerm.length >= 2 && setShowSearchSuggestions(true)
              }
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="flex items-center justify-center px-4 transition-colors bg-blue-600 hover:bg-blue-700 rounded-r-md"
              onClick={() => handleSearch()}
              aria-label="Search"
            >
              <FaSearch className="text-lg text-white" />
            </button>
          </div>

          {/* Search suggestions dropdown for mobile */}
          {showSearchSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg left-4 right-4">
              {searchSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-center px-4 py-3 text-gray-800 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <FaSearch className="mr-2 text-gray-500" />
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Categories Navigation */}
      <div
        className={`bg-white border-b border-gray-200 ${menuOpen ? "block" : "hidden md:block"
          }`}
      >
        <div className="flex flex-col md:flex-row">
          {/* Desktop Categories */}
          <div className="hidden px-6 py-3 overflow-x-auto md:flex gap-7">
            {categories.map((cat, index) => (
              <Link
                to={cat.path}
                key={index}
                className={`flex items-center text-sm font-medium transition-colors whitespace-nowrap ${isActivePath(cat.path)
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                  }`}
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Mobile Categories */}
          {menuOpen && (
            <div className="px-4 py-3 md:hidden">
              <div className="flex items-center mb-4 font-medium text-gray-500">
                <HiMenu className="mr-2" />
                Menu
              </div>
              <div className="grid grid-cols-1 gap-1">
                {categories.map((cat, index) => (
                  <Link
                    to={cat.path}
                    key={index}
                    className={`flex items-center px-3 py-2.5 rounded-md transition-colors ${isActivePath(cat.path)
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                      }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="mr-3 text-blue-600">{cat.icon}</span>
                    {cat.name}
                  </Link>
                ))}
              </div>

              {/* Additional mobile menu items */}
              <div className="pt-4 mt-6 border-t border-gray-200">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                      Account
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-3 py-2.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaUserCircle className="mr-3" />
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-left transition-colors hover:bg-gray-100"
                    >
                      <MdLogout className="mr-2" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/account/login"
                    className="flex items-center justify-center px-4 py-2.5 mt-2 text-white rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaUserCircle className="mr-2" />
                    Sign In
                  </Link>
                )}

                <div className="px-3 py-2 mt-4 text-xs font-semibold text-gray-500 uppercase">
                  Tools
                </div>
                <Link
                  to="/pc-builder"
                  className="flex items-center justify-center px-4 py-2.5 text-white rounded-md bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <FaDesktop className="mr-2" />
                  PC Builder
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;