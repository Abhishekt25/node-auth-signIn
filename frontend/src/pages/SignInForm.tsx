import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            const response = await axios.post(
                "http://localhost:2507/api/signin",
                { email, password },
                { withCredentials: true } // Ensures cookies (JWT) are stored
            );

            if (response.status === 200) {
                alert("signin Successful!");
                navigate("/dashboard"); // Redirect to the dashboard
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "signin failed.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="p-6 bg-white rounded-lg shadow-md w-96"
            >
                <h2 className="text-xl font-semibold mb-4 text-center">Sign In</h2>

                {error && (
                    <div className="text-red-600 bg-red-100 p-2 mb-3 rounded">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default SignIn;
