import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { UserRound, Mail, Bookmark, LogOut, Save } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getMyList } from "../services/myListService";
import "./Profile.css";

function Profile() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState(currentUser?.displayName || "");
    const [savedCount, setSavedCount] = useState(0);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        const loadMyListCount = async () => {
            if (!currentUser) return;
            try {
                const items = await getMyList(currentUser.uid);

                if (active) {
                    setSavedCount(items.length);
                }
            } catch (err) {
                console.error("Failed to load My List count:", err);
            }
        };
        loadMyListCount();
        return () => {
            active = false;
        };
    }, [currentUser]);

    const handleSave = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        const trimmedName = name.trim();
        if (!trimmedName) {
            setError("Please enter your name.");
            return;
        }
        try {
            setSaving(true);
            await updateProfile(currentUser, {
                displayName: trimmedName
            });
            setMessage("Profile updated successfully.");
        } catch (err) {
            console.error("Profile update failed:", err);
            setError("Unable to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Logout failed:", err);
            setError("Unable to log out.");
        }
    };

    return (
        <div className="profile-page">
            <Navbar />
            <main className="profile-container">
                <h1>Account Profile</h1>
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <UserRound size={42} />
                        </div>
                        <div>
                            <h2>
                                {currentUser.displayName || "Netflix User"}
                            </h2>
                            <p>{currentUser.email}</p>
                        </div>
                    </div>
                    <form onSubmit={handleSave} className="profile-form">
                        <label htmlFor="displayName">
                            Display Name
                        </label>

                        <input
                            id="displayName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            maxLength={50}
                        />

                        <label>Email Address</label>

                        <div className="profile-email">
                            <Mail size={18} />
                            <span>{currentUser.email}</span>
                        </div>

                        {message && (
                            <p className="profile-success">{message}</p>
                        )}

                        {error && (
                            <p className="profile-error">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="profile-save-btn"
                            disabled={saving}
                        >
                            <Save size={18} />
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>

                <div className="profile-card profile-actions">
                    <div className="profile-list-summary">
                        <Bookmark size={24} />

                        <div>
                            <h3>My List</h3>
                            <p>{savedCount} saved titles</p>
                        </div>
                    </div>

                    <button
                        className="profile-secondary-btn"
                        onClick={() => navigate("/my-list")}
                    >
                        View My List
                    </button>
                </div>

                <button
                    className="profile-logout-btn"
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                    Log Out
                </button>
            </main>
        </div>
    );
}

export default Profile;
