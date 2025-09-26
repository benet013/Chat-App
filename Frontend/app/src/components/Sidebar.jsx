import api from "../api";
import Users from "./Users";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import { useState,useEffect } from "react";

function Sidebar() {
  const [users, setUsers] = useState([]);
  const [userLoader, setUserLoader] = useState(true);

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
    <div className="sidebar">
      {userLoader?
      (<Box sx={{width: '100%'}}>
        <LinearProgress />
      </Box>) :
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {users.map((user) => (
          <Users key={user.id} id={user.id} username={user.username} email={user.email} />
        ))}
      </List>
      }
    </div>
  );
}

export default Sidebar;