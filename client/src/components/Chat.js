import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiClient from "./useApiClient"; // Import the API client
import io from "socket.io-client";

export default function Chat() {
  const { userId,conversationId } = useParams();
  const apiClient = useApiClient();
   const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = io("http://localhost:5000");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await apiClient.get(`/chat/${conversationId}`);
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();

    socket.on("receiveMessage", (message) => {
      if (message.conversation_id === conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [apiClient, conversationId]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const message = {
      conversation_id: conversationId,
      sender_id: userId,
      content: newMessage,
    };

    try {
      socket.emit("sendMessage", message);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.sender_id}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
