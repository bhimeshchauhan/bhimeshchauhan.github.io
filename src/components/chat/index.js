import React, { useEffect } from 'react';
import { Widget, addResponseMessage, dropMessages } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import '../../styles/chatStyles.css';

const ChatComponent = () => {
  useEffect(() => {
    dropMessages();
    addResponseMessage('Welcome to my portfolio! I built this AI chatbot to help answer any questions you may have. Feel free to ask anything!');
  }, []);

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

  return (
    <Widget
      handleNewUserMessage={handleNewUserMessage}
      title="Bhimesh's Assistant"
      subtitle="Ask me anything!"
    />
  );
};

export default ChatComponent;
