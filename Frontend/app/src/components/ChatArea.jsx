import Message from "./Message";
import MessageInput from "./MessageInput";

function ChatArea() {
  return (
    <div className="chat-area">
      <div className="chat-header"></div>
      <div className="messages">
        <Message text="Hello! How can I help you today?" sent={false} />
        <Message text="I have a question about my order." sent={true} />
        <Message text="Sure! Can you provide your order number?" sent={false} />
        <Message text="Yes, it's 12345." sent={true} />
        <Message text="Thank you! Let me check that for you." sent={false} />
      </div>
      <MessageInput />
    </div>
    )
}

export default ChatArea;