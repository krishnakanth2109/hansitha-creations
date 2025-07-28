// components/AnnouncementBar.tsx
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const AnnouncementBar = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      setMessages(data.messages);
      setIsActive(data.isActive);
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (!isActive || messages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isActive, messages]);

  if (!isActive || messages.length === 0) return null;

  return (
    <div className="h-12 overflow-hidden bg-yellow-400 flex items-center justify-center border-b">
      <div className="relative w-full h-full flex justify-center items-center">
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
