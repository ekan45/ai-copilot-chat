import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './ChatWindow.css';

const TypingEffect = ({ text }) => {
  const [visibleText, setVisibleText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setVisibleText('');
    setCurrentIndex(0);
    
    if (!text) return;

    const words = text.split(' ');
    let currentWordIndex = 0;
    let timeout;

    const typeNextWord = () => {
      if (currentWordIndex < words.length) {
        const newText = words.slice(0, currentWordIndex + 1).join(' ');
        setVisibleText(newText);
        currentWordIndex++;
        timeout = setTimeout(typeNextWord, 100);
      }
    };

    typeNextWord();

    return () => clearTimeout(timeout);
  }, [text]);

  return <p className="typing-text">{visibleText}</p>;
};

const ChatWindow = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('AI Copilot');
  const [typing, setTyping] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    };

    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleAskAI = (query = input) => {
    if (typing || !query.trim()) return;

    setChatStarted(true);
    setTyping(true);
    setInput('');
    setShowSuggestions(false); // Hide suggestions when clicked

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: query,
      sender: 'You',
    };

    const loadingMsg1 = {
      id: Date.now() + 1,
      type: 'ai',
      text: 'Searching for relevant resources...',
      sender: 'Fin',
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      setMessages((prev) => [...prev, loadingMsg1]);

      setTimeout(() => {
        const loadingMsg2 = {
          id: Date.now() + 2,
          type: 'ai',
          text: 'Researching sources I found...',
          sender: 'Fin',
        };

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMsg1.id ? loadingMsg2 : msg
          )
        );

        setTimeout(() => {
          let aiResponse = '';
          const lower = query.toLowerCase();

          if (lower.includes('refund')) {
            aiResponse = 'You can request a refund by going to your orders page and clicking "Request Refund".';
          } else if (lower.includes('secure')) {
            aiResponse = 'Yes, your data is encrypted and secure with us.';
          } else if (lower.includes('order')) {
            aiResponse = 'You can track your order using the tracking link sent to your email.';
          } else if (lower.includes('support')) {
            aiResponse = 'Our support team is available 24/7 to assist you.';
          } else {
            aiResponse = `Let me think... Regarding "${query}", here's what I found: (simulated response)`;
          }

          const finalAIMessage = {
            id: Date.now() + 3,
            type: 'ai',
            text: aiResponse,
            sender: 'Fin',
          };

          setMessages((prev) => [...prev, finalAIMessage]);
          setTyping(false);
          setShowSuggestions(true); // Show suggestions again after AI responds
        }, 1000);
      }, 1000);
    }, 300);
  };

  const suggestions = [
    '💸 How do I get a refund?',
    '🔒 Is my data secure?',
    '📦 Where is my order?',
    '🕓 What are your support hours?',
  ];

  const groupMessages = () => {
    const grouped = [];
    let currentGroup = null;

    messages.forEach((msg, index) => {
      if (!currentGroup || currentGroup.sender !== msg.sender) {
        currentGroup = {
          sender: msg.sender,
          messages: [msg],
        };
        grouped.push(currentGroup);
      } else {
        currentGroup.messages.push(msg);
      }
    });

    return grouped;
  };

  return (
    <motion.div
      className="chat-window"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: chatStarted
          ? 'white'
          : 'linear-gradient(to bottom, #f0f8ff, #e6e6fa)',
      }}
    >
      <div className="tabs">
        <span
          className={activeTab === 'AI Copilot' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('AI Copilot')}
        >
          AI Copilot
        </span>
        <span
          className={activeTab === 'Details' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('Details')}
        >
          Details
        </span>
      </div>

      {!chatStarted && (
        <div className="header">
          <h2>Hi, I'm Fin AI Copilot</h2>
          <p>Ask me anything about this conversation.</p>
        </div>
      )}

      {activeTab === 'AI Copilot' && (
        <>
          <div className="messages">
            {groupMessages().map((group, idx) => (
              <div key={idx} className={`message-group ${group.sender === 'You' ? 'user' : 'ai'}`}>
                <div className="message-sender">
                  {group.sender === 'You' ? (
                    <>
                      <div className="user-logo">Y</div>
                      <span>You</span>
                    </>
                  ) : (
                    <>
                      <div className="ai-logo">F</div>
                      <span>Fin</span>
                    </>
                  )}
                </div>
                {group.messages.map((msg, mIdx) => {
                  const isLoadingLine =
                    msg.text === 'Searching for relevant resources...' ||
                    msg.text === 'Researching sources I found...';
                  const isLast = mIdx === group.messages.length - 1;

                  return (
                    <div
                      key={msg.id}
                      className={`message ${msg.type} ${isLoadingLine ? 'simple-fin-message' : ''}`}
                    >
                      {msg.type === 'ai' && !isLoadingLine && isLast ? (
                        <TypingEffect text={msg.text} />
                      ) : (
                        <div>{msg.text}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {showSuggestions && !typing && (
            <div className="suggestions">
              {suggestions.map((text, index) => (
                <div
                  key={index}
                  className="suggestion"
                  onClick={() => handleAskAI(text)}
                >
                  {text}
                </div>
              ))}
            </div>
          )}

          <div className="input-area">
            <div className="input-wrapper">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={typing}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAskAI();
                  }
                }}
              />
              <button
                className="arrow-inside"
                onClick={() => handleAskAI()}
                disabled={typing}
                aria-label="Send"
              >
                ↑
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === 'Details' && (
        <div className="details-section">
          <p>This is a placeholder for Details content.</p>
        </div>
      )}
    </motion.div>
  );
};

export default ChatWindow;