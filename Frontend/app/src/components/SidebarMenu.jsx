import { useNavigate, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";


function SidebarMenu() {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <div className="icon-strip">
            <div className="top-icons">
                <button
                    onClick={() => navigate('/')}
                    className={`icon-btn ${location.pathname === '/' ? 'active' : ''}`}
                    aria-label="Chat"
                >
                    <IoChatbubbleEllipses size={30} />
                </button>

                <button
                    onClick={() => navigate('/profile')}
                    className={`icon-btn ${location.pathname === '/profile' ? 'active' : ''}`}
                    aria-label="Profile"
                >
                    <CgProfile size={30} />
                </button>
            </div>

            <div className="bottom-icons">
                <button
                    onClick={() => navigate('/logout')}
                    className={`icon-btn ${location.pathname === '/logout' ? 'active' : ''}`}
                    aria-label="logout"
                >
                    <RiLogoutBoxLine size={30} />
                </button>
            </div>
        </div>

    );
}

export default SidebarMenu;