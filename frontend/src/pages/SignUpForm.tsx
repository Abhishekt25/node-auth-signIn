import { useState } from "react";
import {useForm} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";


interface SignUpForm{
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword:string;
}

const SignUp: React.FC =() =>{
    const [errorMessage, setErrorMessage] = useState<string |null >(null);
    const {register , handleSubmit , formState:{errors} } = useForm<SignUpForm>();  //watch
    const navigate =useNavigate();

    const onSubmit= async (data: SignUpForm) =>{
        try{

            const response = await axios.post("http://localhost:5000/api/auth/signin", data);
            localStorage.setItem("token",response.data.token);
            navigate("/login");

        }catch(error){
            setErrorMessage("Registration failed, Try again");
        }
    }

    return(
       <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-96 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
        {errorMessage && <p className="text-red-500 text-center mt-2">{errorMessage}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input type="text" className="w-full p-2 border rounded mt-1" {...register("firstname", { required: "Name is required" })}/>
            {errors.firstname && <p className="text-red-500">{errors.firstname.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input type="text" className="w-full p-2 border rounded mt-1" {...register("lastname", { required: "Name is required" })}/>
            {errors.lastname && <p className="text-red-500">{errors.lastname.message}</p>}
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="w-full p-2 border rounded mt-1" {...register("email", { required: "Email is required" })} />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium">Password</label>
            <input type="password" className="w-full p-2 border rounded mt-1" {...register("password", { required: "Password is required", 
            minLength: { value: 6, message: "Password must be at least 6 characters" } })}/>
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>

          {/* <div className="mt-3">
            <label className="block text-sm font-medium">Confirm Password</label>
            <input type="password" className="w-full p-2 border rounded mt-1"{...register("confirmPassword", {required: "Please confirm your password",
            validate: (value) => value === watch("password") || "Passwords do not match"})}/>
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
          </div> */}

          <button type="submit" className="w-full mt-4 p-2 bg-blue-500 text-white rounded">
            Sign Up
          </button>
        </form>


        <div className="flex justify-between mt-4 text-sm">
          <a href="/signin" className="text-blue-500 hover:underline">Already have an account? Sign In</a>
          <a href="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</a>
        </div>

        </div>
        </div>
    )

};

export default SignUp;