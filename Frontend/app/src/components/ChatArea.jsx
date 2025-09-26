import Message from "./Message";
import MessageInput from "./MessageInput";

function ChatArea({username,messages,onSendMessage,onlineStatus}) {

  return (
    <div className="chat-area">
      <div className="chat-header">{username ? username : "Test"} | {onlineStatus? 'online' : 'offline'}</div>
      <div className="messages">
        {messages? messages.map((msg, index) => (
            <Message key={index} text={msg.message} sent={msg.sent} />
        )) : null}
      </div>
      <MessageInput onSendMessage={onSendMessage}/>
    </div>
    )
}

export default ChatArea;