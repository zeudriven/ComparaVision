"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HomeIcon, 
  CloudArrowUpIcon, 
  ChartBarIcon, 
  ArrowsRightLeftIcon,
  UserIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  isActive: boolean;
  index: number;
}

function NavLink({ href, children, icon, isActive, index }: NavLinkProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.18 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
    >
      <Link href={href}>
        <motion.div
          className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer ${
            isActive
              ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-700 dark:text-green-300"
              : "text-gray-700 hover:text-green-700 dark:text-gray-300 dark:hover:text-green-300"
          }`}
          whileHover={{
            boxShadow: "0 4px 12px rgba(34,197,94,0.08)",
            scale: 1.06
          }}
        >
          <span className="flex items-center">{icon}</span>
          <span className="hidden sm:inline font-medium">{children}</span>
          {isActive && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500"
              layoutId="activeIndicator"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function Nav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: <HomeIcon className="w-5 h-5" />, label: "Home" },
    { href: "/upload", icon: <CloudArrowUpIcon className="w-5 h-5" />, label: "Upload" },
    { href: "/compare", icon: <ArrowsRightLeftIcon className="w-5 h-5" />, label: "Compare" },
    { href: "/dashboard", icon: <ChartBarIcon className="w-5 h-5" />, label: "Dashboard" },
  ];

  return (
    <motion.nav 
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div 
                className="relative w-10 h-10 bg-gradient-to-br from-green-500 via-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <SparklesIcon className="w-6 h-6 text-white" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-green-500 via-blue-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-100"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-display">
                  ComparaVision
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  AI-Powered Analysis
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <motion.div 
            className="flex items-center gap-1"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {navItems.map((item, index) => (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                isActive={pathname === item.href}
                index={index}
              >
                {item.label}
              </NavLink>
            ))}
          </motion.div>

          {/* Auth Buttons */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/signin"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/get-started"
                className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-green-500 via-blue-400 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-150"
              >
                Register
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
} 