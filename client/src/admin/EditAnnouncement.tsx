import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

const EditAnnouncement = () => {
  const [isActive, setIsActive] = useState(true);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const handleAddMessage = () => {
    if (text.trim() !== "") {
      setMessages([...messages, text]);
      setText("");
    }
  };

  const handleRemoveMessage = (index: number) => {
    const updated = [...messages];
    updated.splice(index, 1);
    setMessages(updated);
    if (currentIndex >= updated.length) {
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    if (!isActive || messages.length === 0 || paused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4000); // change message every 2 seconds

    return () => clearInterval(interval);
  }, [isActive, messages, paused]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/api/announcements");
      setIsActive(res.data.isActive);
      setMessages(res.data.messages);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Announcement Bar</h2>

      <div className="flex items-center justify-between mb-4">
        <label className="text-lg font-medium">Announcement Active:</label>
        <Switch checked={isActive} onCheckedChange={setIsActive} />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Add New Message:</label>
        <Textarea
          rows={2}
          placeholder="Type your message here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-end">
          <Button
            className="mt-4 bg-green-600 text-white hover:bg-green-700 w-full"
            onClick={async () => {
              try {
                await axios.post("/api/announcements", {
                  messages,
                  isActive,
                });
                alert("Announcement saved!");
              } catch (err) {
                console.error(err);
                alert("Error saving announcement.");
              }
            }}
          >
            Add Message
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <p className="font-medium mb-2">Messages:</p>
        <ul className="list-disc list-inside space-y-1">
          {messages.map((msg, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{msg}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveMessage(index)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {isActive && messages.length > 0 && (
        <div className="mt-6">
          <p className="font-medium mb-1">Live Preview:</p>
          <div
            className="relative h-12 overflow-hidden rounded shadow bg-yellow-400 text-black flex items-center justify-center"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute w-full text-center px-4"
              >
                {messages[currentIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAnnouncement;
