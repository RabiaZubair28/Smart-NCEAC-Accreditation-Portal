import { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import styles from "./ChatBot.module.css";
import { processQuery } from "../services/geminiService";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize theme from user preferences
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else if (prefersDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const handleSendMessage = async (text) => {
    // Add user message
    const userMessage = {
      text,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Add temporary bot message with loading state
    setIsLoading(true);

    try {
      // Process the query
      const response = await processQuery(text);

      // Add bot response
      const botMessage = {
        text: response.text,
        sender: "bot",
        timestamp: new Date().toISOString(),
        source: response.source,
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error processing message:", error);

      // Add error message
      const errorMessage = {
        text: "I'm having trouble processing your request. Please try again later.",
        sender: "bot",
        timestamp: new Date().toISOString(),
        source: "error",
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatbot}>
      <ChatHeader />
      <ChatMessages messages={messages} onSendMessage={handleSendMessage} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatBot;
