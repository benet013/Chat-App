import ChatArea from "../components/ChatArea";
import Sidebar from "../components/Sidebar";
import "../styles/Home.css"

function Home(){
    return(
        <>
            <div className="chat-container">
                <Sidebar />
                <ChatArea />
            </div>
        </>
    )
}

export default Home