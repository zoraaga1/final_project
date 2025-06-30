"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react"; // optional, use any icon lib

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-700 transition"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-xl shadow-lg z-50 flex flex-col overflow-hidden">
          <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
            Chat Support
          </div>
          <div className="flex-1 p-3 overflow-y-auto">
            {/* Chat messages would go here */}
            <p className="text-sm text-gray-600">Hello! How can we help you?</p>
          </div>
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 text-sm border rounded-lg outline-none"
            />
            <button className="px-3 bg-blue-600 text-white rounded-lg text-sm">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
