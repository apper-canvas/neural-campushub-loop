import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import { routeArray } from "@/config/routes";

const Layout = () => {
  const { user } = useSelector((state) => state.user);
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const pageTransitionInitial = { opacity: 0, x: 20 };
  const pageTransitionAnimate = { opacity: 1, x: 0 };
  const pageTransitionExit = { opacity: 0, x: -20 };
  const pageTransitionConfig = { duration: 0.3 };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Mobile Header */}
      <header className="lg:hidden flex-shrink-0 h-16 bg-white border-b border-surface-200 px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
            <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-display font-bold text-surface-900">CampusHub</h1>
        </div>
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
        >
          <ApperIcon name="Menu" className="w-6 h-6 text-surface-600" />
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-60 bg-white border-r border-surface-200 flex-col z-40">
          {/* Logo */}
          <div className="p-6 border-b border-surface-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-surface-900">CampusHub</h1>
                <p className="text-sm text-surface-500">Academic Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {routeArray.map((route) => (
                <li key={route.id}>
                  <NavLink
                    to={route.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} className="w-5 h-5" />
                    <span className="font-medium">{route.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Info */}
{/* User Info */}
          <div className="p-4 border-t border-surface-200">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-50">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || 'S'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-surface-500">Student</p>
              </div>
              <button
                onClick={logout}
                className="p-1 text-surface-400 hover:text-error-600 transition-colors"
                title="Logout"
              >
<ApperIcon name="LogOut" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={closeMobileMenu}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white shadow-xl z-50 flex flex-col"
              >
                {/* Mobile Menu Header */}
                <div className="p-6 border-b border-surface-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                        <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h1 className="text-xl font-display font-bold text-surface-900">CampusHub</h1>
                        <p className="text-sm text-surface-500">Academic Management</p>
                      </div>
                    </div>
                    <button
                      onClick={closeMobileMenu}
                      className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                    >
                      <ApperIcon name="X" className="w-5 h-5 text-surface-600" />
                    </button>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                  <ul className="space-y-2">
                    {routeArray.map((route) => (
                      <li key={route.id}>
                        <NavLink
                          to={route.path}
                          onClick={closeMobileMenu}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                              isActive
                                ? 'bg-primary-50 text-primary-700 border border-primary-200'
                                : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                            }`
                          }
                        >
                          <ApperIcon name={route.icon} className="w-5 h-5" />
                          <span className="font-medium">{route.label}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Mobile User Info */}
{/* Mobile User Info */}
                <div className="p-4 border-t border-surface-200">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-50">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || 'S'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-surface-500">Student</p>
                    </div>
                    <button
                      onClick={logout}
                      className="p-1 text-surface-400 hover:text-error-600 transition-colors"
                      title="Logout"
                    >
                      <ApperIcon name="LogOut" className="w-4 h-4" />
                    </button>
                  </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={pageTransitionInitial}
            animate={pageTransitionAnimate}
            exit={pageTransitionExit}
            transition={pageTransitionConfig}
            className="h-full"
>
            <Outlet context={{ user, logout }} />
          </motion.div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden flex-shrink-0 border-t border-surface-200 bg-white">
        <nav className="flex">
          {routeArray.slice(0, 5).map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2 px-1 ${
                  isActive ? 'text-primary-600' : 'text-surface-400'
                }`
              }
            >
              <ApperIcon name={route.icon} className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium truncate">{route.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;