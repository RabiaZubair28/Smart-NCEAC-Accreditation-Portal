import { useState, useRef, useEffect } from 'react';
import styles from './ChatInput.module.css';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);
  
  useEffect(() => {
    // Focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };
  
  // Dynamically adjust textarea height based on content
  const adjustTextareaHeight = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };
  
  return (
    <form className={styles.inputContainer} onSubmit={handleSubmit}>
      <textarea 
        ref={inputRef}
        className={styles.input}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          adjustTextareaHeight(e);
        }}
        onKeyPress={handleKeyPress}
        placeholder="Ask about NCEAC..."
        disabled={isLoading}
        rows={1}
      />
      <button 
        type="submit" 
        className={`${styles.sendButton} ${(!message.trim() || isLoading) ? styles.disabled : ''}`}
        disabled={!message.trim() || isLoading}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
        </svg>
      </button>
    </form>
  );
};

export default ChatInput;