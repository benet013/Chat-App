import api from "../api";
import Users from "./Users";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useState, useEffect } from "react";
import SidebarMenu from "./SidebarMenu";

function UserSidebar() {
  const [users, setUsers] = useState([]);
  const [userLoader, setUserLoader] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/getUsers/");
      setUsers(response.data);
      setUserLoader(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }


  return (
    <>
      <nav className="sidebar" role="navigation" aria-label="Main navigation">
        <SidebarMenu />
        <div className="chat-panel">
          <div className="title">

            <h3>CHAT-HUB</h3>
          </div>

          <div className="chat-section">
            <div className="section-header">
              <span className="section-title">DIRECT MESSAGES</span>
            </div>
          </div>

          {userLoader ?
            (<Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>) :
            <div className="chat-list">
              {users.map((user) => (
                <Users
                  key={user.id}
                  id={user.id}
                  username={user.username.toUpperCase()}
                  isSelected={selectedUser === user.id}
                  onSelect={() => setSelectedUser(user.id)}
                  image={user.profile_image_url}
                />
              ))}
            </div>
          }
        </div>
      </nav>
    </>
  );
}

export default UserSidebar;