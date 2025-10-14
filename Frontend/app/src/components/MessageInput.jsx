import { useState } from "react";
import { IoSend } from "react-icons/io5";


function MessageInput({ onSendMessage, chatSocket }) {
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setMessage(e.target.value)
        chatSocket.current.send(JSON.stringify({
            type: 'typing',
            message: e.target.value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() === "") return;
        onSendMessage(message);
        setMessage("");
    }

    return (
        <>
            <div className="message-input-container">
                <form onSubmit={handleSubmit} className="message-form">
                    <input type="text" 
                    className="message-input" 
                    placeholder="Type your message..." 
                    value={message} 
                    onChange={handleChange}
                    aria-label="Type your message" />
                    <button type="submit" className="send-btn" aria-label="Send message">
                        <IoSend />
                    </button>
                </form>
            </div>
        </>
    );
}

export default MessageInput;