import React from "react";
import { useForm } from "react-hook-form";
import API from "../api";

type SignUpFormData = {
  fname: string;
  lname: string
  email: string;
  password: string;
};

const SignUpForm: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<SignUpFormData>();

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await API.post("/auth/signup", data);
      alert(response.data.message);
      reset();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error occurred!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded shadow">
      <h2 className="text-lg font-bold mb-4">Sign Up</h2>
      <input {...register("fname", { required: true })} placeholder="fname" className="border p-2 mb-2 w-full"/>
      <input {...register("lname", { required: true })} placeholder="lname" className="border p-2 mb-2 w-full"/>
      <input {...register("email", { required: true })} type="email" placeholder="Email" className="border p-2 mb-2 w-full" />
      <input {...register("password", { required: true })} type="password" placeholder="Password" className="border p-2 mb-2 w-full"/>

       <button type="submit" className="bg-blue-500 text-white py-2 px-4">Sign Up </button>
    </form>
  );
};

export default SignUpForm;
