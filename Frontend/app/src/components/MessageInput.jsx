import React, { useState } from "react";

function MessageInput({onSendMessage}) {
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setMessage(e.target.value);
    }

    const handleSubmit = () => {
        if (message.trim() === "") return;
        onSendMessage(message);
        setMessage("");
    }

    return (
        <div className="message-input">
            <textarea
                placeholder="Type your message..." 
                value={message} 
                onChange={handleChange}
            />
            <button onClick={handleSubmit}>Send</button>
        </div>
    ); 
}

export default MessageInput;