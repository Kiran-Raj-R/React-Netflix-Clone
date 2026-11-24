import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Signup() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();
    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }
        if (password.length < 6) {
            return setError("Password must contain at least 6 characters");
        }

        try {
            setLoading(true);
            await signup(email, password);
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1>NETFLIX</h1>
                <h2>Create Account</h2>
                <form onSubmit={handleSignup}>
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
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {error && (
                        <p className="auth-error">{error}</p>
                    )}
                    <button type="submit" disabled={loading}>
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>
                <p>
                    Already have an account?
                    <Link to="/login"> Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;