import React, { useEffect, useState } from 'react';
import 'react-chat-widget/lib/styles.css';
import '../../styles/chatStyles.css';

// Lazy-load the Widget to prevent SSR issues
const ChatWidget = React.lazy(() => import('react-chat-widget').then((module) => ({ default: module.Widget })));
const addResponseMessage = React.lazy(() => import('react-chat-widget').then((module) => ({ default: module.addResponseMessage })));
const dropMessages = React.lazy(() => import('react-chat-widget').then((module) => ({ default: module.dropMessages })));


const ChatComponent = () => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true); // Ensure this runs only in the browser
  }, []);

  useEffect(() => {
    if (isBrowser) {
      dropMessages();
      addResponseMessage('Welcome to my portfolio! I built this AI chatbot to help answer any questions you may have. Feel free to ask anything!');
    }
  }, [isBrowser]);

  const handleNewUserMessage = async (newMessage) => {
    console.log(`New message: ${newMessage}`);
    try {
      const response = await fetch('https://bhimeshchauhan-github-io.onrender.com/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: newMessage }),
      });

      const data = await response.json();
      console.log('API response:', response);
      if (data.response) {
        addResponseMessage(data.response);
      } else {
        addResponseMessage('Sorry, I could not find an answer to your question.');
      }
    } catch (error) {
      console.error('Error making API call:', error);
      addResponseMessage('An error occurred while trying to get a response. Please try again.');
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
