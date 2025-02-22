import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "../pages/SignInForm";
import SignUp from "../pages/SignUpForm";

const LoginRoutes: React.FC =()=>{
    return(
        <Router>
            <Routes>
                <Route path="/signin" element={<SignIn/> } />
                <Route path="/signup" element={< SignUp/>} />
                <Route path="/" element={<h1>Welcome to Dashboard</h1>} />
                <Route path="/forgot-password" element={<h1>Forgot Password Page</h1>} />
                <Route path="/register" element={<h1>Register Page</h1>} />
            </Routes>
        </Router>
    );
};

export default LoginRoutes;