const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';


function Message({ text, sent, timestamp, image }) {
    const imgUrl = API_BASE+image;
    return (
        <div className={`message ${sent ? "outgoing" : "incoming"}`}>
            {!sent && <img src={imgUrl} alt="Bella Cote" className="message-avatar" onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/default.jpg"; 
            }}></img>}            
            <div className="message-content">
                <div className="message-bubble">
                    {text}
                </div>
                <div className="message-time">{timestamp}</div>
            </div>
        </div>
    )
}

export default Message; 