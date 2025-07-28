import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner"; // <== Snackbar toast

const EditAnnouncement = () => {
  const [isActive, setIsActive] = useState(true);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [originalMessages, setOriginalMessages] = useState<string[]>([]);
  const [originalActive, setOriginalActive] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAddMessage = () => {
    if (text.trim() !== "") {
      setMessages([...messages, text.trim()]);
      setText("");
    }
  };

  const handleRemoveMessage = (index: number) => {
    const updated = [...messages];
    updated.splice(index, 1);
    setMessages(updated);
  };

  const fetchAnnouncements = async () => {
    const res = await fetch("/api/announcements");
    const data = await res.json();
    setMessages(data.messages || []);
    setOriginalMessages(data.messages || []);
    setIsActive(data.isActive);
    setOriginalActive(data.isActive);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, isActive }),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success("Announcement saved successfully");

      setOriginalMessages(messages);
      setOriginalActive(isActive);
    } catch (error) {
      toast.error("Failed to save announcement");
    }
  };

  const hasChanges =
    JSON.stringify(messages) !== JSON.stringify(originalMessages) ||
    isActive !== originalActive;

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
        <div className="mt-2 flex justify-end">
          <Button
            className="bg-black text-white hover:bg-gray-900"
            onClick={handleAddMessage}
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

      <Button
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        disabled={!hasChanges}
        onClick={handleSave}
      >
        Save Changes
      </Button>

      {isActive && messages.length > 0 && (
        <div className="mt-6">
          <p className="font-medium mb-1">Live Preview:</p>
          <div className="relative h-12 overflow-hidden border rounded bg-yellow-400 flex items-center justify-center">
            <div className="relative w-full h-full flex justify-center items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "-100%", opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute font-medium text-black text-center"
                >
                  {messages[currentIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAnnouncement;
