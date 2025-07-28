import React, { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

const AnnouncementBar = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/announcements");
        setMessages(res.data.messages || []);
        setIsActive(res.data.isActive);
      } catch (err) {
        console.error("Failed to fetch announcements", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!isActive || messages.length === 0 || paused) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [messages, isActive, paused]);

  if (!isActive || messages.length === 0) return null;

  return (
    <div
      className="relative bg-yellow-400 text-black py-2 px-4 text-sm font-medium text-center overflow-hidden h-10 flex items-center justify-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute w-full px-4"
        >
          {messages[current]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnnouncementBar;
