import { useEffect, useState } from "react";
import api from "../api";
import SidebarMenu from "../components/SidebarMenu";
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get("/profile/");
        setImagePreview(res.data.image || null);
        setUsername(res.data.username || "");
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    }
    loadProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setRemoveImage(false);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (imageFile) formData.append("image", imageFile);
    if (removeImage) formData.append("remove_image", "true");
    if (username) formData.append("username", username)

    console.log(formData)

    try {
      const res = await api.patch("/profile/", formData);

      setImagePreview(res.data.image || null);
      setImageFile(null);
      setRemoveImage(false);
    } catch (err) {
      console.log(err)
    }

    setLoading(false);
    navigate('/');
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unicons.iconscout.com/release/v4.0.8/css/line.css"
      />
      <div className="app-container">
        <SidebarMenu />
        <div className={"popup-box show"}>
          <div className="popup">
            <div className="content">
              <header>
                <i
                  className="uil uil-times"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate('/')
                  }
                />
              </header>

              <form onSubmit={handleSubmit} className="profile-form">
                <title>
                  <h2>Update</h2>
                </title>
                <div className="profile-section">
                  <div className="profile-wrapper">
                    <div className="profile-img">
                      <img
                        src={
                          imagePreview ||
                          "default.jpg"
                        }
                        alt="Profile"
                      />
                    </div>
                    <label className="add-btn">
                      <IoIosAdd />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                    </label>

                  </div>
                </div>

                <div className="input-group">
                  <p className="subtitle">Username</p>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Saving..." : "Update"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </>

  );
}

export default Profile;