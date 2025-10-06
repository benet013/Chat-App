import Message from "./Message";
import MessageInput from "./MessageInput";

function ChatArea({ username, messages, onSendMessage, onlineStatus, chatSocket, isTyping }) {

  return (
    <div className="chat-area">
      <div className="chat-header">{username ? username : "Test"} | {onlineStatus ? 'online' : 'offline'}</div>
      <div className="messages">
        {messages ? messages.map((msg, index) => (
          <Message key={index} text={msg.message} sent={msg.sent} />
        )) : null}
      </div>
      {isTyping &&
        <div className="messages">
          <div className={"message received"}>
            <div className="message-bubble">
              <i>typing...</i>
            </div>
          </div>
        </div>}
      <MessageInput onSendMessage={onSendMessage} chatSocket={chatSocket} />
    </div>
  )
}

export default ChatArea;