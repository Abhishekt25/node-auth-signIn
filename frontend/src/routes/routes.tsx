import { Routes, Route } from "react-router-dom"; 
import SignIn from "../pages/SignInForm";
import SignUp from "../pages/SignUpForm";
import LogOut from "../pages/LogOut";

const LoginRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<h1>Welcome to Dashboard</h1>} />
            <Route path="/forgot-password" element={<h1>Forgot Password Page</h1>} />
            <Route path="/logout" element={<LogOut />} />
        </Routes>
    );
};

export default LoginRoutes;
