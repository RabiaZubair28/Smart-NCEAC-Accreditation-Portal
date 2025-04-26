import { useRef, useEffect } from "react";
import Message from "./Message";
import styles from "./ChatMessages.module.css";

const ChatMessages = ({ messages, onSendMessage }) => {
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleQuestionClick = (question) => {
    onSendMessage(question);
  };

  // Show welcome message if no messages
  const renderWelcomeMessage = () => {
    return (
      <div className={styles.welcome}>
        <div className={styles.welcomeIcon}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h2 className={styles.welcomeTitle}>Welcome to NCEAC Assistant</h2>
        <p className={styles.welcomeText}>
          I'm here to help with your questions about the National Computing
          Education Accreditation Council, CLOs, PLOs, and accreditation
          processes.
        </p>
        <div className={styles.sampleQuestions}>
          <h3>Try asking about:</h3>
          <div className={styles.questionChips}>
            <button
              className={styles.questionChip}
              onClick={() => handleQuestionClick("What is NCEAC?")}
            >
              What is NCEAC?
            </button>
            <button
              className={styles.questionChip}
              onClick={() =>
                handleQuestionClick("How are CLOs and PLOs connected?")
              }
            >
              How are CLOs and PLOs connected?
            </button>
            <button
              className={styles.questionChip}
              onClick={() => handleQuestionClick("Who creates batches?")}
            >
              Who creates batches?
            </button>
            <button
              className={styles.questionChip}
              onClick={() => handleQuestionClick("How are students assessed?")}
            >
              How are students assessed?
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.messagesContainer}>
      {messages.length === 0 ? (
        renderWelcomeMessage()
      ) : (
        <div className={styles.messages}>
          {messages.map((message, index) => (
            <Message
              key={index}
              message={message}
              isLast={index === messages.length - 1}
            />
          ))}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
