import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

function Users(props) {
    const userUrl = `/user/${props.id}`;
    return (
        <Link to={userUrl}>
            <ListItem>
                <ListItemAvatar>
                    <Avatar></Avatar>
                </ListItemAvatar>
                <ListItemText primary={props.username} secondary={props.email} />
            </ListItem>
        </Link>
    );
}

export default Users;