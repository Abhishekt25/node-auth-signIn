import React from "react";
import { useForm } from "react-hook-form";
import API from "../api";

type SignInFormData = {
  email: string;
  password: string;
};

const SignInForm: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<SignInFormData>();

  const onSubmit = async (data: SignInFormData) => {
    try {
      const response = await API.post("/auth/signin", data);
      alert(`Welcome ${response.data.username}`);
      reset();
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded shadow">
      <h2 className="text-lg font-bold mb-4">Sign In</h2>
      <input
        {...register("email", { required: true })}
        type="email"
        placeholder="Email"
        className="border p-2 mb-2 w-full"
      />
      <input
        {...register("password", { required: true })}
        type="password"
        placeholder="Password"
        className="border p-2 mb-2 w-full"
      />
      <button type="submit" className="bg-blue-500 text-white py-2 px-4">
        Sign In
      </button>
    </form>
  );
};

export default SignInForm;
