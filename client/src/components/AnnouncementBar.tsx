import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const AnnouncementBar = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${baseUrl}/api/announcements`);
        const data = await res.json();
        console.log("📩 Announcement data:", data);
        setMessages(data.messages || []);
        setIsActive(data.isActive);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (!isActive || messages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isActive, messages]);

  if (!isActive || messages.length === 0) return null;

  return (
    <div className="h-12 bg-yellow-400 border-b overflow-hidden flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute text-center font-medium text-black px-4"
          >
            {messages[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnnouncementBar;
