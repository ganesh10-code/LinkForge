import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import TextField from './TextField';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../apis/api';
import toast from 'react-hot-toast';
import { useStoreContext } from '../contextApi/ContextApi';
import { FaLink } from 'react-icons/fa6';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loader, setLoader] = useState(false);
    const { setToken } = useStoreContext();

    const message = location.state?.message;

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
        mode: "onTouched",
    });

    const loginHandler = async (data) => {
        setLoader(true);
        try {
            const { data: response } = await api.post(
                "/api/auth/public/login",
                data
            );
            setToken(response.token);
            localStorage.setItem("JWT_TOKEN", JSON.stringify(response.token));
            toast.success("Signed in successfully!");
            reset();
            navigate("/dashboard");
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.error || "Invalid credentials. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoader(false);
        }
    };

  return (
    <div className='min-h-[calc(100vh-64px)] flex flex-col justify-center items-center bg-bgColor py-12 sm:px-6 lg:px-8'>
        
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mb-4 shadow-sm">
                <FaLink className="text-xl" />
            </div>
            <h2 className="text-3xl font-bold text-primary tracking-tight">
                Welcome back
            </h2>
            <p className="mt-2 text-sm text-textSecondary">
                Sign in to your LinkForge account
            </p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-[440px]">
            {message && (
                <div className="mb-4 p-4 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium text-center">
                    {message}
                </div>
            )}
            <div className="bg-white py-10 px-6 shadow-soft border border-borderColor rounded-2xl sm:px-10">
                <form className="space-y-6" onSubmit={handleSubmit(loginHandler)}>
                    <TextField
                        label="Username"
                        required
                        id="username"
                        type="text"
                        message="Username is required"
                        placeholder="e.g. johndoe"
                        register={register}
                        errors={errors}
                    />

                    <TextField
                        label="Password"
                        required
                        id="password"
                        type="password"
                        message="Password is required"
                        placeholder="••••••••"
                        register={register}
                        min={6}
                        errors={errors}
                    />

                    <button
                        disabled={loader}
                        type='submit'
                        className='w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-70 disabled:cursor-not-allowed'
                    >
                        {loader ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : "Sign in"}
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-textSecondary">
                                Don't have an account?
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Link
                            to="/register"
                            className="w-full flex justify-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-textMain bg-white hover:bg-slate-50 transition-colors"
                        >
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default LoginPage
