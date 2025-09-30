import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ChatArea from "../components/ChatArea";
import Sidebar from "../components/Sidebar";
import "../styles/Home.css"
import api from "../api";
import { ACCESS_TOKEN } from "../constant";

function Home() {
    const { id } = useParams();
    const [recentMessage, setRecentMessage] = useState({});
    const [selfUser, setSelfUser] = useState(null);
    const [otherUser, setOtherUser] = useState(null);
    const [roomName, setRoomName] = useState(null);
    const [status, setStatus] = useState({});
    const chatSocket = useRef(null);


    const getUserId = async () => {
        try {
            const response = await api.get("/getUserId/");
            setSelfUser(response.data['id']);
        } catch (error) {
            console.error("Error fetching user ID:", error);
        }
    }

    const getOtherUser = async () => {
        try {
            const response = await api.get(`/getUsers/${id}`);
            setOtherUser(response.data['username']);

        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }

    const createConversation = async () => {
        try {
            const response = await api.post('conversation/', { id });
            setRoomName(response.data['id']);

        } catch (error) {
            console.error("Error creating conversation:", error);
        }
    }

    const getMessages = async (conId) => {
        if (!conId) return;
        try {
            const response = await api.get(`/getMessages/${conId}/`);
            const messages = response.data;

            if (conId in recentMessage) return;
            messages.forEach(msg => {
                setRecentMessage(prev => ({
                    ...prev,
                    [conId]: [...(prev[conId] || []), { 'message': msg.content, 'sent': selfUser === msg.sender }],
                }));
            });
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }

    useEffect(() => {
        getUserId();
    }, []);


    useEffect(() => {
        if (selfUser === null || id === undefined) {
            return;
        }

        createConversation();
        getOtherUser();

        if (!roomName) {
            return;
        }
        getMessages(roomName);

        const token = localStorage.getItem(ACCESS_TOKEN);
        const url = `ws://localhost:8000/ws/chat/${roomName}/?token=${token}`;
        chatSocket.current = new WebSocket(url);

        chatSocket.current.onopen = (e) => {
            console.log("Connection established");
        }

        chatSocket.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(data.type)

            if (data.type === 'online_status') {
                setStatus(prev => ({ ...prev, [data.user]: data.status === 'online' }));
            }
            else if (data.type === 'chat_message') {
                setRecentMessage(prev => ({
                    ...prev,
                    [roomName]: [...(prev[roomName] || []), { 'message': data.message, 'sent': selfUser === data.sent }],
                }));
            }
        }

        chatSocket.current.onclose = () => {
            console.error("Chat socket closed unexpectedly");
        }

        return () => {
            chatSocket.current?.close();
        };

    }, [id, roomName]);

    const sendMessage = (msg) => {
        if (chatSocket.current && chatSocket.current.readyState === WebSocket.OPEN) {
            const payload = { type: 'chat_message', message: msg };
            chatSocket.current.send(JSON.stringify(payload));
        } else {
            console.warn("Socket not open yet.");
        }
    };

    const isPartnerOnline = otherUser ? !!status[String(otherUser)] : false;

    return (
        <>
            <div className="chat-container">
                <Sidebar />
                <ChatArea username={otherUser} messages={roomName ? recentMessage[roomName] : []} onSendMessage={sendMessage} onlineStatus={isPartnerOnline} />
            </div>
        </>
    )
}

export default Home