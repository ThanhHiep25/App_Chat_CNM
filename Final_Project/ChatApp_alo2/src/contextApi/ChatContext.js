import React, { createContext, useContext, useState } from 'react';

const ChatsContext = createContext();

export const ChatsProvider = ({ children }) => {
  const [chats, setChats] = useState([]);

  return (
    <ChatsContext.Provider value={{ chats, setChats }}>
      {children}
    </ChatsContext.Provider>
  );
};

export const useChats = () => useContext(ChatsContext);
