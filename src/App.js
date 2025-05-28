import { useState, useEffect, useRef } from 'react';
import { 
  Send, User, Users, Copy, ThumbsUp, ThumbsDown, 
  Sun, Moon, Paperclip, Mic, WifiOff, Clipboard, AlertCircle
} from 'react-feather';

function App() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'ai', 
      content: 'Hello! I\'m your AI tutor. How can I assist you today? Whether you need help with programming concepts, math problems, or just want to explore a topic, I\'m here to help!', 
      timestamp: new Date(), 
      liked: null 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [connectionStatus, setConnectionStatus] = useState('online');
  const messagesEndRef = useRef(null);

  const quickReplies = [
    "Calculate the volume of a sphere with r=3",
    "Define kinetic energy",
    "What's machine learning?",
    "What is the atomic number of carbon?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  useEffect(() => {
    testConnection();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 4000);
  };

  const testConnection = async () => {
    try {
      const response = await fetch('https://tutor-app-adk.onrender.com/health', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        setConnectionStatus('online');
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus('offline');
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      liked: null
    };
    
    const currentInput = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {


      const response = await fetch('https://tutor-app-adk.onrender.com/chat', {
        method: 'POST',
        mode: 'cors',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin,
        },
        body: JSON.stringify({
          content: currentInput,
          user_id: "Chirag Mathur"
        })
      });


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      const aiResponse = {
        id: Date.now() + 1,
        role: 'ai',
        content: data.full_response || 'Sorry, I received an empty response.',
        timestamp: new Date(),
        liked: null
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setConnectionStatus('online');

    } catch (error) {
      console.error('Request failed:', error);
      
      let errorMessage = 'Sorry, I encountered an error. ';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage += 'Unable to connect to the server. Please check your internet connection.';
        setConnectionStatus('offline');
      } else if (error.message.includes('CORS')) {
        errorMessage += 'There\'s a connection issue with our servers. Please try again in a moment.';
        setConnectionStatus('error');
      } else {
        errorMessage += error.message;
        setConnectionStatus('error');
      }

      const errorResponse = {
        id: Date.now() + 1,
        role: 'ai',
        content: errorMessage,
        timestamp: new Date(),
        liked: null,
        isError: true
      };
      
      setMessages(prev => [...prev, errorResponse]);
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setIsTyping(false); 
    }
  };

  const handleQuickReply = (reply) => {
    setInputValue(reply);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Message copied to clipboard!');
  };

  const handleLike = (id, value) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, liked: value } : msg
    ));
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'error': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <header className={`py-2 px-6 flex justify-between items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg z-10`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-500'}`}>
            <Users size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">IntelliTutor</h1>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}></div>
              <span className="text-xs capitalize">{connectionStatus}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={testConnection}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
            title="Test connection"
          >
            <WifiOff size={20} />
          </button>
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4 overflow-hidden">
        <div className={`flex-1 rounded-2xl overflow-hidden shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Messages Container */}
          <div className="h-[calc(100vh-220px)] overflow-y-auto p-4 pb-20 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`mb-6 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-[85%]">
                  <div className="flex items-center mb-1">
                    {message.role === 'ai' && (
                      <div className={`mr-2 p-1.5 rounded-lg ${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                        <Users size={16} className={isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} />
                      </div>
                    )}
                    <span className="font-medium text-sm">
                      {message.role === 'user' ? 'You' : 'IntelliTutor'}
                    </span>
                    {message.role === 'user' && (
                      <div className={`ml-2 p-1.5 rounded-lg ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                        <User size={16} className={isDarkMode ? 'text-purple-300' : 'text-purple-600'} />
                      </div>
                    )}
                    {message.isError && (
                      <AlertCircle size={16} className="ml-2 text-red-500" />
                    )}
                  </div>
                  
                  <div 
                    className={`p-4 rounded-2xl ${
                      message.role === 'user' 
                        ? (isDarkMode 
                            ? 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white' 
                            : 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white')
                        : message.isError
                        ? (isDarkMode ? 'bg-red-900 border border-red-700' : 'bg-red-100 border border-red-300')
                        : (isDarkMode 
                            ? 'bg-gray-700' 
                            : 'bg-gray-100')
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs opacity-70">
                      {formatTime(message.timestamp)}
                    </span>
                    <div className="flex space-x-1">
                      {message.role === 'ai' && !message.isError && (
                        <>
                          <button 
                            onClick={() => handleLike(message.id, true)}
                            className={`p-1 rounded ${message.liked === true ? 'text-green-500' : 'opacity-50 hover:opacity-100'}`}
                          >
                            <ThumbsUp size={14} />
                          </button>
                          <button 
                            onClick={() => handleLike(message.id, false)}
                            className={`p-1 rounded ${message.liked === false ? 'text-red-500' : 'opacity-50 hover:opacity-100'}`}
                          >
                            <ThumbsDown size={14} />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleCopy(message.content)}
                        className="p-1 rounded opacity-50 hover:opacity-100"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-6">
                <div className="max-w-[85%]">
                  <div className="flex items-center mb-1">
                    <div className={`mr-2 p-1.5 rounded-lg ${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                      <Users size={16} className={isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} />
                    </div>
                    <span className="font-medium text-sm">IntelliTutor</span>
                  </div>
                  <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Quick Replies */}
        <div className="flex flex-wrap gap-2 mt-4">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => handleQuickReply(reply)}
              className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                isDarkMode 
                  ? 'bg-indigo-900 text-indigo-200 hover:bg-indigo-800' 
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
            >
              {reply}
            </button>
          ))}
        </div>
        
        {/* Input Area */}
        <div className={`mt-4 rounded-2xl shadow-xl p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-end space-x-3">
            <div className="flex space-x-2">
              <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                <Paperclip size={20} />
              </button>
              <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                <Mic size={20} />
              </button>
            </div>
            
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Message IntelliTutor..."
              className={`flex-1 min-h-[40px] max-h-24 py-2 px-3 rounded-lg focus:outline-none resize-none ${
                isDarkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500' 
                  : 'bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-indigo-400'
              }`}
              style={{ height: '40px' }}
            />
            
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className={`p-3 rounded-xl flex-shrink-0 transition-all ${
                inputValue.trim() && !isTyping
                  ? (isDarkMode 
                      ? 'bg-indigo-600 hover:bg-indigo-500' 
                      : 'bg-indigo-500 hover:bg-indigo-400 text-white')
                  : (isDarkMode 
                      ? 'bg-gray-700 text-gray-500' 
                      : 'bg-gray-200 text-gray-400')
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast.show && (
        <div 
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-fadeIn ${
            toast.type === 'error' 
              ? 'bg-red-500 text-white' 
              : 'bg-indigo-500 text-white'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle size={18} />
          ) : (
            <Clipboard size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default App;