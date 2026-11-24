import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import MyList from "./pages/MyList";
import Search from "./pages/Search";
import Browse from "./pages/Browse";
import Profile from "./pages/Profile";

function NotFound() {
    return <h1>Page Not Found</h1>;
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={ <Home />}/>
            <Route path="/details/:mediaType/:id" element={
                    <ProtectedRoute>
                        <MovieDetails />
                    </ProtectedRoute>
                }
            />
            <Route path="/my-list" element={
                    <ProtectedRoute>
                        <MyList />
                    </ProtectedRoute>
                }
            />
            <Route path="/search" element={
                    <ProtectedRoute>
                        <Search />
                    </ProtectedRoute>
                }
            />
            <Route path="/movies" element={
                    <ProtectedRoute>
                        <Browse mediaType="movie" />
                    </ProtectedRoute>
                }
            />
            <Route path="/tv-shows" element={
                    <ProtectedRoute>
                        <Browse mediaType="tv" />
                    </ProtectedRoute>
                }
            />
            <Route path="/profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;