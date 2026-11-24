import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            setLoading(true);
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1>NETFLIX</h1>
                <h2>Sign In</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && (
                        <p className="auth-error">{error}</p>
                    )}
                    <button type="submit" disabled={loading}>
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>
                <p>
                    New to Netflix?
                    <Link to="/signup"> Sign Up Now</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;