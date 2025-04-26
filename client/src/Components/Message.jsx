import React, { useEffect, useState } from 'react';
import styles from './Message.module.css';

const Message = ({ message, isLast }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Show animation effect
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const { text, sender } = message;

    // Typing animation only for bot and if it's the last message
    if (sender === 'bot' && isLast) {
      let i = 0;
      setTypedText('');
      setIsTyping(true);

      const interval = setInterval(() => {
        i++;
        setTypedText(text.slice(0, i));
        if (i === text.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 15);

      return () => clearInterval(interval);
    } else {
      // Instantly show text for user or older messages
      setTypedText(text);
      setIsTyping(false);
    }
  }, [message, isLast]);

  const getMessageClass = () => {
    const base = styles.message;
    const from = message.sender === 'user' ? styles.userMessage : styles.botMessage;
    return `${base} ${from} ${isVisible ? styles.visible : ''}`;
  };

  return (
    <div className={getMessageClass()}>
      {message.sender === 'bot' && (
        <div className={styles.botAvatar}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor" />
          </svg>
        </div>
      )}

      <div className={styles.messageContent}>
        <div className={styles.messageText}>
          {typedText}
          {isTyping && <span className={styles.cursor}></span>}
        </div>
        {isTyping && message.sender === 'bot' && (
          <div className={styles.typingIndicator}>
            NCEAC Assistant is typing<span>.</span><span>.</span><span>.</span>
          </div>
        )}
        {message.timestamp && (
          <div className={styles.messageTime}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
