

function Message({text, sent}) {
  return (
    <div className={`message ${sent ? "sent" : "received"}`}>
        <div className="message-bubble">
            {text}
        </div>
    </div>
    )
}

export default Message; 