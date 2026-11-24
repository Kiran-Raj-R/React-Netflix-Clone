export const requireAuth = (currentUser, navigate, action) => {
    if (!currentUser) {
        navigate("/login");
        return false;
    }
    if (action) {
        action();
    }
    return true;
};