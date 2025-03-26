import React, { useState, useEffect, useRef } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import { FaMicrophone } from 'react-icons/fa';
import { useSpeechSynthesis } from 'react-speech-kit';
import './App.css';

const API_KEY = "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";

const systemMessage = {
  "role": "system",
  "content": "You are SAHAAYAK, an AI Legal Assistant specialized in Indian laws, rights, regulations, and legal news. Your only role is to answer **strictly law-related questions.** If the user asks something unrelated to legal matters, simply respond: 'I am a legal assistant. Please ask only legal or law-related questions.'"
};

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am SAHAAYAK! Ask me about legal rights, laws, or regulations in India.",
      sentTime: "just now",
      sender: "LEGALASSISTANT"
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { speak, cancel } = useSpeechSynthesis();

  const recognitionRef = useRef(null); // Reference to speech recognition instance

  useEffect(() => {
    if (!recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // 🔹 Stop after a single response
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        setInputValue(transcript);

        if (event.results[0].isFinal) {
          handleSend(transcript);
          setIsListening(false);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log("Speech Recognition Ended");
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleSend = async (message) => {
    const newMessage = { message, direction: 'outgoing', sender: "user" };
    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);
    await processMessageToChatBOT(newMessages);
  };

  const processMessageToChatBOT = async (chatMessages) => {
    const apiMessages = chatMessages.map((messageObject) => ({
      role: messageObject.sender === "LEGALASSISTANT" ? "assistant" : "user",
      content: messageObject.message
    }));

    const apiRequestBody = {
      "model": "llama3-8b-8192",
      "messages": [systemMessage, ...apiMessages]
    };

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      });

      const data = await response.json();

      let botResponse = "I am a legal assistant. Please ask only legal or law-related questions.";

      if (data?.choices?.[0]?.message?.content) {
        botResponse = data.choices[0].message.content;
      }

      setMessages([...chatMessages, { message: botResponse, sender: "LEGALASSISTANT" }]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error processing message:", error);
      setIsTyping(false);
    }
  };

  // Start Speaking (Read Message)
  const startSpeaking = () => {
    if (messages.length > 0) {
      setIsSpeaking(true);
      speak({ text: messages[messages.length - 1].message, onEnd: () => setIsSpeaking(false) });
    }
  };

  // Stop Speaking
  const stopSpeaking = () => {
    setIsSpeaking(false);
    cancel();
  };

  // Start Listening (Prevents restarting if already running)
  const startListening = () => {
    if (!isListening) {
      console.log("Starting Speech Recognition...");
      recognitionRef.current.stop(); // Ensure any existing session is stopped
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Stop Listening (Fully stop recognition)
  const stopListening = () => {
    console.log("Stopping Speech Recognition...");
    recognitionRef.current.stop();
    setIsListening(false);
  };

  return (
    <div className="App">
      <div className="buttonContainer">
        {/* Start/Stop Speaking Button */}
        <button style={{ marginRight: '10px' }} onClick={isSpeaking ? stopSpeaking : startSpeaking}>
          {isSpeaking ? "Stop Speaking" : "Start Speaking"}
        </button>

        {/* Listen/Stop Listening Button */}
        <button onClick={isListening ? stopListening : startListening}>
          {isListening ? "Stop Listening" : "Start Listening"}
        </button>
      </div>
      
      <div style={{ height: "500px", width: "600px", alignItems: "center" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="LEGAL Assistant is typing" /> : null}
            >
              {messages.map((message, i) => (
                <Message key={i} model={{ message: message.message, sentTime: message.sentTime, sender: message.sender }} />
              ))}
            </MessageList>
            <MessageInput 
              placeholder='Type message here' 
              value={inputValue}
              onChange={(val) => setInputValue(val)}
              onSend={handleSend} 
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default Chatbot;
