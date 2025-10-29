import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ChatArea from "../components/ChatArea";
import UserSidebar from "../components/Sidebar";
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
    const [isTyping, setIsTyping] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
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
            console.log(response.data)
            setOtherUser(response.data['username']);
            setImageUrl(response.data['profile_image_url'])

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
                const date = new Date(msg.timestamp);
                
                const formattedTime = new Intl.DateTimeFormat('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }).format(date)

                setRecentMessage(prev => ({
                    ...prev,
                    [conId]: [...(prev[conId] || []), { 'message': msg.content, 'sent': selfUser === msg.sender, 'timestamp': formattedTime , 'image':msg.sender_image_url}],
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

        chatSocket.current.onopen = () => {
            chatSocket.current.send(JSON.stringify({ 'type': 'online/offline', 'roomname': roomName, 'user': selfUser }));
            console.log("Connection established");
        }

        chatSocket.current.onmessage = (e) => {
            const data = JSON.parse(e.data);

            if (data.type === 'online_status') {
                setStatus(prev => ({ ...prev, [data.user]: data.status === 'online' }));
            }
            else if (data.type === 'chat_message') {
                const dateNow = new Date();
                const formattedTimeNow = new Intl.DateTimeFormat('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }).format(dateNow)
                setRecentMessage(prev => ({
                    ...prev,
                    [roomName]: [...(prev[roomName] || []), { 'message': data.message, 'sent': selfUser === data.sent, 'timestamp': formattedTimeNow , 'image': data.image}],
                }));
            }
            else if (data.type === 'typing') {
                console.log(data, selfUser)
                if (selfUser !== data.user) {
                    setIsTyping(true);
                } setTimeout(() => {
                    setIsTyping(false);
                }, 2000);
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
    console.log("Status:", status);
    const isPartnerOnline = otherUser ? !!status[String(otherUser)] : false;

    return (
        <>
            <div className="app-container">
                <UserSidebar />
                <ChatArea
                    username={otherUser}
                    image ={imageUrl}
                    messages={roomName ? recentMessage[roomName] : []}
                    onSendMessage={sendMessage}
                    onlineStatus={isPartnerOnline}
                    chatSocket={chatSocket}
                    isTyping={isTyping} />
            </div>
        </>
    )
}

export default Home