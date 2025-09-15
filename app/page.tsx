"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import InteractiveCounter from "@/components/InteractiveCounter";
import DynamicForm from "@/components/DynamicForm";
import DataVisualization from "@/components/DataVisualization";
import DragDropList from "@/components/DragDropList";
import SearchFilter from "@/components/SearchFilter";
import Modal from "@/components/Modal";
import AnimatedCards from "@/components/AnimatedCards";
import RealTimeChat from "@/components/RealTimeChat";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [userStats, setUserStats] = useState({
    clicks: 0,
    interactions: 0,
    timeSpent: 0,
  });

  useEffect(() => {
    // Track time spent on page
    const startTime = Date.now();
    const interval = setInterval(() => {
      setUserStats((prev) => ({
        ...prev,
        timeSpent: Math.floor((Date.now() - startTime) / 1000),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleInteraction = (type: string) => {
    setUserStats((prev) => ({
      ...prev,
      interactions: prev.interactions + 1,
      clicks: type === "click" ? prev.clicks + 1 : prev.clicks,
    }));
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "interactive", label: "Interactive" },
    { id: "data", label: "Data Viz" },
    { id: "chat", label: "Real-time Chat" },
  ];

  return (
    <div className="min-h-screen">
      <Header userStats={userStats} />

      {/* Hero Section */}
      <motion.section
        className="py-20 px-4 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Dynamic Next.js App
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Experience the power of dynamic interactions, real-time updates, and
          modern UI components deployed seamlessly on Azure App Services.
        </p>
        <motion.button
          onClick={() => {
            setIsModalOpen(true);
            handleInteraction("click");
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Features
        </motion.button>
      </motion.section>

      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex justify-center space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                handleInteraction("tab-switch");
              }}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content Based on Active Tab */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AnimatedCards onInteraction={handleInteraction} />
              <InteractiveCounter onInteraction={handleInteraction} />
            </div>
          )}

          {activeTab === "interactive" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DynamicForm onInteraction={handleInteraction} />
                <DragDropList onInteraction={handleInteraction} />
              </div>
              <SearchFilter onInteraction={handleInteraction} />
            </div>
          )}

          {activeTab === "data" && (
            <DataVisualization onInteraction={handleInteraction} />
          )}

          {activeTab === "chat" && (
            <RealTimeChat onInteraction={handleInteraction} />
          )}
        </motion.div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInteraction={handleInteraction}
      />
    </div>
  );
}
