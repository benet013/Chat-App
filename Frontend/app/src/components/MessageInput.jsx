import React, { useState } from "react";

function MessageInput() {
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setMessage(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Message submitted:", message);
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