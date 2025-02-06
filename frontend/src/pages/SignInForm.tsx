import { useState } from "react";
import {useForm} from "react-hook-form";
import {useNavigate } from "react-router-dom";
import axios from "axios";

interface SignInForm {
    email:string;
    password:string;
    rememberMe:boolean;
}

const SignIn :React.FC = () => {

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<SignInForm>();
    const navigate = useNavigate();  

    
    const onSubmit = async (data:SignInForm) =>{
        try{
            const response = await axios.post("http://localhost:5000/api/auth/signin", data);
            localStorage.setItem("token", response.data.token);

            if(data.rememberMe){
                localStorage.setItem("email",data.email);
            }
            navigate("/");

        }catch(error){
            setErrorMessage("Invalid email and password");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-96 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center">Sign In</h2>
  
          {errorMessage && <p className="text-red-500 text-center mt-2">{errorMessage}</p>}
  
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input  type="email" className="w-full p-2 border rounded mt-1" {...register("email", { required: "Email is required" })}/>
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
  
            <div className="mt-3">
              <label className="block text-sm font-medium">Password</label>
              <input type="password" className="w-full p-2 border rounded mt-1"{...register("password", { required: "Password is required" })}/>
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
                <div className="mt-3 flex items-center">
                <input type="checkbox" id="rememberMe" {...register("rememberMe")} className="mr-2"/>
                <label htmlFor="rememberMe" className="text-sm">Remember Me</label>
           </div>
  
            <button type="submit" className="w-full mt-4 p-2 bg-blue-500 text-white rounded">Sign In</button>
          </form>

          <div className="flex justify-between mt-4 text-sm">
            <a href="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</a>
            <a href="/signup" className="text-blue-500 hover:underline">SignUp</a>
          </div>

        </div>
      </div>
    );
};

export default SignIn;

