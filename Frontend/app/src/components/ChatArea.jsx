import Message from "./Message";
import MessageInput from "./MessageInput";

function ChatArea({ username, image,messages, onSendMessage, onlineStatus, chatSocket, isTyping }) {

  return (
    <>
      {username && <main className="main-content" role="main">
        <header className="chat-header">
          <div className="header-left">
            <img src={image} alt="Bella Cote" className="header-avatar" />
            <div className="header-info">
              <h1 className="header-name">{username.toUpperCase()}</h1>
              <div className="header-status">
                <span className="status-dot"></span>
                {onlineStatus ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
        </header>

        <div className="messages-container">
          {messages ? messages.map((msg, index) => (
            <Message key={index} text={msg.message} sent={msg.sent} timestamp={msg.timestamp} image={msg.image}/>
          )) : null}

          {isTyping &&
            <div className="message incoming">
              <img src={image} alt="Bella Cote" className="message-avatar" />
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
            </div>
          }
        </div>

        <MessageInput onSendMessage={onSendMessage} chatSocket={chatSocket} />
      </main>}
    </>
  )
}

export default ChatArea;