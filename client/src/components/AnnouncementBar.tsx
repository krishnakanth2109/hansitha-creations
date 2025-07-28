import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type AnnouncementBarProps = {
  messages: string[];
  isActive: boolean;
};

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ messages, isActive }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isActive || messages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isActive, messages]);

  if (!isActive || messages.length === 0) return null;

  return (
    <div className="h-12 bg-yellow-400 border-b border-yellow-600 flex items-center justify-center relative overflow-hidden">
      <div className="relative w-full h-full flex justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute w-full text-center px-4 font-medium text-black"
          >
            {messages[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnnouncementBar;
