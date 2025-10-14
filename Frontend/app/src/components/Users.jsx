import { Link } from "react-router-dom";

function Users({id,username,isSelected,onSelect,image}) {
    const userUrl = `/chat/user/${id}`;
    return (
        <>
            <Link to={userUrl} onClick={onSelect} className="chat-item" role="option" aria-selected={isSelected}>
                <img src={image} alt="Bella Cote" className="avatar" />
                <div className="chat-info">
                    <div className="chat-name">{username}</div>
                </div>
            </Link>
        </>

    );
}

export default Users;