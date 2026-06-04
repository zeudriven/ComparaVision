"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { 
  CloudArrowUpIcon, 
  ArrowsRightLeftIcon, 
  ChartBarIcon, 
  BoltIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  LightBulbIcon,
  CogIcon
} from "@heroicons/react/24/outline";

// Floating particles component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

// Feature card component
function FeatureCard({ icon: Icon, title, description, color, delay }: {
  icon: any;
  title: string;
  description: string;
  color: string;
  delay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ 
        y: -5,
        scale: 1.02,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)"
      }}
      className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-8 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:border-green-300/50 dark:hover:border-green-600/50 transition-all duration-200"
    >
      <motion.div
        className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}
        whileHover={{ rotate: 3 }}
      >
        <Icon className="w-8 h-8 text-white" />
      </motion.div>
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
      
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        initial={false}
      />
    </motion.div>
  );
}

// Animated gradient text component
function AnimatedGradientText({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      className="bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent"
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        backgroundSize: "200% 200%",
      }}
    >
      {children}
    </motion.span>
  );
}

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const brightness = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]); // parallax effect

  const features = [
    {
      icon: CloudArrowUpIcon,
      title: "Enterprise-Ready Upload",
      description: "Upload vision models (YOLO, VLMs, etc) with instant cost and performance analysis. Designed for production and scale.",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      delay: 0.1
    },
    {
      icon: ArrowsRightLeftIcon,
      title: "Side-by-Side Comparison",
      description: "Compare models across accuracy, speed, memory, and cost. Make data-driven decisions for your business needs.",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      delay: 0.2
    },
    {
      icon: ChartBarIcon,
      title: "Performance Analytics",
      description: "Track detailed metrics, visualize trends, and benchmark vision models for enterprise deployment.",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      delay: 0.3
    },
    {
      icon: BoltIcon,
      title: "Efficient Inference",
      description: "Deploy models with optimized inference pipelines for maximum throughput and minimal latency.",
      color: "bg-gradient-to-br from-teal-500 to-teal-600",
      delay: 0.4
    },
    {
      icon: GlobeAltIcon,
      title: "Carbon-Aware Upload",
      description: "Upload models with automatic carbon footprint calculation. Get instant environmental impact insights.",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      delay: 0.5
    },
    {
      icon: ShieldCheckIcon,
      title: "Green Security",
      description: "Secure model storage with energy-efficient infrastructure and sustainable practices.",
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      delay: 0.6
    }
  ];

  const whyPoints = [
    {
      icon: GlobeAltIcon,
      title: "Reduce AI Carbon Footprint",
      description: "Make informed decisions about model efficiency and environmental impact. Every choice matters for our planet.",
      color: "text-green-600 dark:text-green-400"
    },
    {
      icon: LightBulbIcon,
      title: "Sustainable AI Development",
      description: "Build AI systems that are both powerful and environmentally responsible. Future-proof your technology stack.",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: CogIcon,
      title: "Optimize for Efficiency",
      description: "Find the perfect balance between performance and energy consumption. Do more with less environmental cost.",
      color: "text-emerald-600 dark:text-emerald-400"
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[140vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Interactive pixel art forest backdrop */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("/forest-pixel-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: `center ${bgY.get()}`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#b6e3d4',
            scale,
            filter: brightness.get() ? `brightness(${brightness.get()})` : undefined,
            opacity: 1
          }}
        />
        
        {/* Background gradients */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
          style={{ y, opacity: useTransform(scrollYProgress, [0, 0.5], [0.15, 0]) }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10 opacity-10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-full border border-gray-200/50 dark:border-gray-700/50 mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <GlobeAltIcon className="w-5 h-5 text-green-600" />
                </motion.div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sustainable AI Platform
                </span>
              </div>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-display leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Vision Model Comparison
              <br />
              <AnimatedGradientText>Cost-Efficient. Carbon Smart.</AnimatedGradientText>
            </motion.h1>

            <motion.p 
              className="text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Instantly compare vision models (YOLO, VLMs, etc) for accuracy, speed, and cost. Track carbon footprint and optimize for sustainable, green AI. Build smarter, cleaner computer vision.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-28 mt-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/upload"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 via-blue-400 to-emerald-500 text-white font-semibold rounded-2xl hover:shadow-2xl transition-all duration-200 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 opacity-0 group-hover:opacity-100"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                  <span className="relative flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.4 }}
                    >
                      <CloudArrowUpIcon className="w-6 h-6" />
                    </motion.div>
                    Upload Media & Models
                  </span>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/compare"
                  className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-green-500 dark:hover:border-green-400 transition-all duration-200 hover:shadow-xl"
                >
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ArrowsRightLeftIcon className="w-6 h-6 mr-3" />
                  </motion.div>
                  Start Comparing
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-16 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Why Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("/forest-pixel-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: `center ${bgY.get()}`,
            backgroundRepeat: 'no-repeat',
            filter: `brightness(1.10) blur(1.5px)`,
            scale,
            opacity: 0.7
          }}
        />
        <div className="absolute inset-0 bg-white/80 z-10" />
        <div className="relative max-w-7xl mx-auto z-20">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 font-display">
              Why <AnimatedGradientText>Vision Model Comparison?</AnimatedGradientText>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the best vision model for your needs - faster, cheaper, and greener.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="text-center group"
              >
                <motion.div
                  className={`w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200`}
                  whileHover={{ rotate: 5 }}
                >
                  <point.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className={`text-xl font-bold mb-4 ${point.color}`}>
                  {point.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("/forest-pixel-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: `center ${bgY.get()}`,
            backgroundRepeat: 'no-repeat',
            filter: `brightness(1.08) blur(1.5px)`,
            scale,
            opacity: 0.85
          }}
        />
        <div className="absolute inset-0 bg-white/70 z-10" />
        <div className="relative max-w-7xl mx-auto z-20">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 font-display">
              Vision Model Comparison <AnimatedGradientText>Features</AnimatedGradientText>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Compare, optimize, and deploy vision models for enterprise use cases—maximize accuracy, speed, and cost efficiency. Plus, track and minimize your environmental impact with built-in Green AI tools.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: 'url("/forest-pixel-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.95) blur(2px)',
          opacity: 0.5
        }} />
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/30 via-blue-600/20 to-emerald-600/30 z-10" />
        <div className="relative max-w-4xl mx-auto text-center z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6 font-display">
              Ready to Compare Vision Models—Responsibly?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join the movement: achieve enterprise-grade vision model performance and cost savings, while building a more sustainable AI future.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/get-started"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-200 hover:shadow-2xl"
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating elements */}
        <motion.div
          className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-10 right-10 w-24 h-24 bg-white/5 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </section>
    </div>
  );
}
