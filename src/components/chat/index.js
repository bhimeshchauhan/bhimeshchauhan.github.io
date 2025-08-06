import React, { useEffect, useState } from 'react';
import 'react-chat-widget/lib/styles.css';
import '../../styles/chatStyles.css';
import DOMPurify from 'dompurify';

// Lazy-load the Widget to prevent SSR issues
const ChatWidget = React.lazy(() => import('react-chat-widget').then((module) => ({ default: module.Widget })));

const ChatComponent = () => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true); // Ensure this runs only in the browser
  }, []);

  useEffect(() => {
    if (isBrowser) {
      // Wait for the widget to be fully initialized
      const timer = setTimeout(() => {
        try {
          // Only add the welcome message, skip dropMessages
          import('react-chat-widget').then(({ addResponseMessage }) => {
            if (typeof addResponseMessage === 'function') {
              addResponseMessage('Welcome to my portfolio! I built this AI chatbot to help answer any questions you may have. Feel free to ask anything!');
            }
          }).catch((error) => {
            console.warn('Failed to load chat widget functions:', error);
          });
        } catch (error) {
          console.warn('Chat widget not ready yet:', error);
        }
      }, 1000); // Wait 1 second for widget to initialize

      return () => clearTimeout(timer);
    }
  }, [isBrowser]);

  // Sanitize input to prevent XSS attacks
  const sanitizeInput = (input) => {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    // Remove any HTML tags and scripts
    const sanitized = DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [], // No HTML tags allowed
      ALLOWED_ATTR: [], // No attributes allowed
      KEEP_CONTENT: true // Keep the text content
    });
    
    // Additional security: remove common script patterns
    const scriptPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /data:text\/html/gi,
      /vbscript:/gi,
      /expression\s*\(/gi
    ];
    
    let cleanInput = sanitized;
    scriptPatterns.forEach(pattern => {
      cleanInput = cleanInput.replace(pattern, '');
    });
    
    // Trim whitespace and limit length
    return cleanInput.trim().substring(0, 1000);
  };

  const handleNewUserMessage = async (newMessage) => {
    console.log(`New message: ${newMessage}`);
    
    // Sanitize the input
    const sanitizedMessage = sanitizeInput(newMessage);
    
    // Check if message is empty after sanitization
    if (!sanitizedMessage) {
      try {
        const { addResponseMessage } = await import('react-chat-widget');
        addResponseMessage('Please enter a valid message without any special characters or scripts.');
        return;
      } catch (importError) {
        console.error('Failed to import chat widget functions:', importError);
        return;
      }
    }
    
    try {
      const response = await fetch('https://svrkaceygixujjakhfsl.functions.supabase.co/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2cmthY2V5Z2l4dWpqYWtoZnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MTQzMDIsImV4cCI6MjA3MDA5MDMwMn0.2l3kNQ_rIn1zjz9jXkyrHQ7Ku3xOMhrZrBTo4sDJeMY'
        },
        body: JSON.stringify({ query: sanitizedMessage }),
      });

      const data = await response.json();
      console.log('API response:', response);
      
      // Dynamically import addResponseMessage when needed
      const { addResponseMessage } = await import('react-chat-widget');
      if (data.response) {
        // Also sanitize the response before displaying
        const sanitizedResponse = DOMPurify.sanitize(data.response, {
          ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p'],
          ALLOWED_ATTR: ['href', 'target'],
          ALLOW_DATA_ATTR: false
        });
        addResponseMessage(sanitizedResponse);
      } else {
        addResponseMessage('Sorry, I could not find an answer to your question.');
      }
    } catch (error) {
      console.error('Error making API call:', error);
      try {
        const { addResponseMessage } = await import('react-chat-widget');
        addResponseMessage('An error occurred while trying to get a response. Please try again.');
      } catch (importError) {
        console.error('Failed to import chat widget functions:', importError);
      }
    }
  };

  if (!isBrowser) {
    // Prevent rendering during SSR
    return null;
  }

  return (
    <React.Suspense fallback={<div>Loading chat...</div>}>
      <ChatWidget
        handleNewUserMessage={handleNewUserMessage}
        title="Bhimesh's Assistant"
        subtitle="Ask me anything!"
      />
    </React.Suspense>
  );
};

export default ChatComponent;
