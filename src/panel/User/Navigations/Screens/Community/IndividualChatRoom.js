import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import EmojiSelector from "react-native-emoji-selector";
import { useRoute } from "@react-navigation/native";
import socketServices from "../../../Socket/SocketServices";
const IndividualChatRoom = () => {
  const route = useRoute();
  const { item } = route.params;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(item.messages || []);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const senderId = '6694f1e2fef273737d9196c7'
  const flatListRef = useRef(null);
  const scrollToEnd = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };
  useEffect(() => {
    scrollToEnd();
  }, []);
  const chatList = item._id;
  useEffect(() => {
    // Join the group when the component mounts
    socketServices.emit('join_Individual', chatList);
    // Fetch chat history when the component mounts
    socketServices.emit('getindividualChatHistory', chatList);

    // Listen for new messages

    // Listen for chat history from the server
    const handleChatHistory = (chatHistory) => {
      setMessages(chatHistory);
    };
    // Handle any errors fetching chat history
    const handleChatHistoryError = (error) => {
      console.error('Error fetching chat history:', error);
    };
    // Handle errors
    const handleError = (error) => {
      console.error('Error:', error.message);
    };

    // Register event listeners
    socketServices.on('received_individual_message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });
    socketServices.on('chatHistory', handleChatHistory);
    socketServices.on('chatHistoryError', handleChatHistoryError);

    socketServices.on('error', handleError);
    // Clean up event listeners on unmount
    return () => {
      socketServices.removeListener('chatHistory', handleChatHistory);
      socketServices.removeListener('chatHistoryError', handleChatHistoryError);
      socketServices.removeListener('received_individual_message');
      socketServices.removeListener('error', handleError);
    };
  }, [chatList]);
  const handleSend = () => {
    if (input.trim()) {
      const newMessage = {
        conversationId: chatList,
        senderId,
        content: input,
        sender: { _id: senderId, name: 'You' },
        time: new Date().toISOString(),
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      socketServices.emit('send_individual_message', newMessage);
      socketServices.emit('getindividualChatHistory', chatList);
      setInput('');
      scrollToEnd();
    }
  };
  const handleAttachFile = async () => {
    try {
      console.log("File attachment functionality triggered");
    } catch (error) {
      console.error("Error handling file attachment:", error);
    }
  };
  const handleVoiceInput = async () => {
    try {
      console.log("Voice input functionality triggered");
    } catch (error) {
      console.error("Error handling voice input:", error);
    }
  };
  const toggleEmojiPicker = () => {
    if (!showEmojiPicker) {
      Keyboard.dismiss();
      setTimeout(() => setShowEmojiPicker(true), 100);
    } else {
      setShowEmojiPicker(false);
    }
  };
  const handleEmojiSelect = (emoji) => {
    setInput((prevInput) => prevInput + emoji);
  };
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const renderItem = ({ item }) => {
    const isSenderValid = item.sender && item.sender._id;
    const isSentByCurrentUser = isSenderValid && item.sender._id === senderId;
    return (
      <View
        style={[
          styles.messageContainer,
          isSentByCurrentUser ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <Text style={styles.message}>{item.content}</Text>
        <Text style={styles.time}>{(item.createdAt === undefined ? formatTime(new Date().toISOString()) : formatTime(item.createdAt))}</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.chatList}
        onContentSizeChange={scrollToEnd}
      />
      <View style={styles.inputContainer}>
        <Icon
          name="emoticon-happy-outline"
          size={24}
          color="#7A7A7A"
          style={styles.icon}
          onPress={toggleEmojiPicker}
        />
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={(text) => {
              setInput(text);
              if (showEmojiPicker) {
                setShowEmojiPicker(false);
              }
            }}
            placeholder="Type your message"
            placeholderTextColor="#7A7A7A"
            multiline={true}
            onFocus={() => setShowEmojiPicker(false)}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <Icon
            name="paperclip"
            size={20}
            color="#7A7A7A"
            style={styles.innerIcon}
            onPress={handleAttachFile}
          />
          <Icon
            name="microphone-outline"
            size={20}
            color="#7A7A7A"
            style={styles.innerIcon}
            onPress={handleVoiceInput}
          />
        </View>
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Icon name="send-circle" size={35} color="#6E3BD4" />
        </TouchableOpacity>
      </View>
      {showEmojiPicker && (
        <EmojiSelector
          onEmojiSelected={handleEmojiSelect}
          showSearchBar={false}
          showTabs={false}
          showHistory={false}
          showSectionTitles={false}
          columns={8}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chatList: {
    paddingHorizontal: 15,
  },
  messageContainer: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  sentMessage: {
    backgroundColor: "#D1E7DD",
    alignSelf: "flex-end",
  },
  receivedMessage: {
    backgroundColor: "#F0F0F0",
    alignSelf: "flex-start",
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  message: {
    fontSize: 16,
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
    color: "#888",
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#F0F0F0",
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
  },
  innerIcon: {
    marginHorizontal: 5,
  },
  icon: {
    marginHorizontal: 5,
  },
  sendButton: {
    marginLeft: 5,
  },
});
export default IndividualChatRoom;